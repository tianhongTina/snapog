import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

interface PayPalWebhookEvent {
  event_type: string;
  resource: {
    id: string;
    subscriber?: {
      email_address?: string;
      payer_id?: string;
    };
    plan_id?: string;
    status?: string;
    custom_id?: string;
  };
}

const getPlanFromPlanId = (planId: string): 'pro' | 'business' | null => {
  if (planId === process.env.PAYPAL_PRO_PLAN_ID) return 'pro';
  if (planId === process.env.PAYPAL_BUSINESS_PLAN_ID) return 'business';
  return null;
};

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const body = await request.text();
    const event = JSON.parse(body) as PayPalWebhookEvent;

    const supabase = createServiceClient();

    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED': {
        const subscriptionId = event.resource.id;
        const planId = event.resource.plan_id;
        const customId = event.resource.custom_id; // We'll set this to user_id

        if (!planId) break;

        const plan = getPlanFromPlanId(planId);
        if (!plan || !customId) break;

        // Update user profile with subscription details
        const { error } = await supabase
          .from('profiles')
          .update({
            plan,
            paypal_subscription_id: subscriptionId,
            subscription_status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('id', customId);

        if (error) {
          console.error('Failed to update profile on subscription activation:', error);
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        const subscriptionId = event.resource.id;

        // Find user with this subscription
        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('id')
          .eq('paypal_subscription_id', subscriptionId)
          .single();

        if (fetchError || !profile) break;

        // Downgrade to free
        await supabase
          .from('profiles')
          .update({
            plan: 'free',
            subscription_status: event.event_type === 'BILLING.SUBSCRIPTION.CANCELLED'
              ? 'cancelled'
              : 'expired',
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id);

        break;
      }

      case 'BILLING.SUBSCRIPTION.SUSPENDED': {
        const subscriptionId = event.resource.id;

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('paypal_subscription_id', subscriptionId)
          .single();

        if (!profile) break;

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'expired',
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id);

        break;
      }

      default:
        // Log unhandled events
        console.log('Unhandled PayPal webhook event:', event.event_type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
};
