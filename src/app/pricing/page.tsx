'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  PayPalScriptProvider,
  PayPalButtons,
} from '@paypal/react-paypal-js';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { toast } from '@/components/ui/use-toast';
import { Check, X, Zap, Palette, Code2, Globe } from 'lucide-react';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  highlighted: boolean;
  badge?: string;
  cta: string;
  planType: 'free' | 'pro' | 'business';
}

const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for personal projects.',
    planType: 'free',
    features: [
      { text: '50 requests per month', included: true },
      { text: '3 templates', included: true },
      { text: 'Visual editor', included: true },
      { text: 'URL extractor', included: true },
      { text: 'No watermark', included: false },
      { text: 'API access', included: false },
      { text: 'Custom fonts', included: false },
      { text: 'Priority support', included: false },
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'For developers and content creators.',
    planType: 'pro',
    badge: 'Most Popular',
    features: [
      { text: '1,000 requests per month', included: true },
      { text: 'All 10 templates', included: true },
      { text: 'Visual editor', included: true },
      { text: 'URL extractor', included: true },
      { text: 'No watermark', included: true },
      { text: 'API access', included: true },
      { text: 'Custom fonts', included: true },
      { text: 'Priority support', included: true },
    ],
    cta: 'Subscribe with PayPal',
    highlighted: true,
  },
  {
    name: 'Business',
    price: '$29',
    period: '/month',
    description: 'For teams and high-volume apps.',
    planType: 'business',
    features: [
      { text: '10,000 requests per month', included: true },
      { text: 'All 10 templates', included: true },
      { text: 'Visual editor', included: true },
      { text: 'URL extractor', included: true },
      { text: 'No watermark', included: true },
      { text: 'API access', included: true },
      { text: 'Custom fonts', included: true },
      { text: 'Priority support', included: true },
    ],
    cta: 'Subscribe with PayPal',
    highlighted: false,
  },
];

const PayPalSubscribeButton = ({
  planType,
}: {
  planType: 'pro' | 'business';
}) => {
  const planId =
    planType === 'pro'
      ? process.env.NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID || ''
      : process.env.NEXT_PUBLIC_PAYPAL_BUSINESS_PLAN_ID || '';

  return (
    <PayPalButtons
      style={{ layout: 'vertical', label: 'subscribe' }}
      createSubscription={(_data, actions) => {
        return actions.subscription.create({
          plan_id: planId,
        });
      }}
      onApprove={(data) => {
        toast({
          title: 'Subscription activated!',
          description: `Your ${planType} plan is now active. Subscription ID: ${data.subscriptionID}`,
        });
        // Redirect to dashboard keys (Pro/Business users)
        window.location.href = '/dashboard/keys';
        return Promise.resolve();
      }}
      onError={(err) => {
        console.error('PayPal error:', err);
        toast({
          title: 'Payment failed',
          description: 'There was an issue processing your payment. Please try again.',
          variant: 'destructive',
        });
      }}
    />
  );
};

export default function PricingPage() {
  const [billingError, setBillingError] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  // While hovering, the hovered card is active; otherwise default to the highlighted plan
  const getActive = (name: string, defaultHighlighted: boolean) => {
    if (hoveredPlan !== null) return hoveredPlan === name;
    return defaultHighlighted;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start for free. Upgrade as you grow. Cancel anytime through PayPal.
            </p>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {plans.map((plan) => {
              const active = getActive(plan.name, plan.highlighted);
              return (
              <div
                key={plan.name}
                onMouseEnter={() => setHoveredPlan(plan.name)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`relative rounded-2xl p-8 border cursor-pointer transition-all duration-300 ${
                  active
                    ? 'border-primary bg-primary/5 shadow-2xl -translate-y-2'
                    : 'border-border bg-background shadow-sm'
                }`}
              >
                {plan.badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    {plan.badge}
                  </Badge>
                )}

                <div className="mb-6">
                  <h2 className="text-lg font-semibold">{plan.name}</h2>

                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-center gap-2 text-sm">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span className={!feature.included ? 'text-muted-foreground line-through' : ''}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.planType === 'free' ? (
                  <Button
                    variant={active ? 'default' : 'outline'}
                    className="w-full"
                    asChild
                  >
                    <Link href="/editor">{plan.cta}</Link>
                  </Button>
                ) : (
                  <div>
                    {PAYPAL_CLIENT_ID && !billingError ? (
                      <PayPalScriptProvider
                        options={{
                          clientId: PAYPAL_CLIENT_ID,
                          vault: true,
                          intent: 'subscription',
                        }}
                      >
                        <PayPalSubscribeButton planType={plan.planType} />
                      </PayPalScriptProvider>
                    ) : (
                      <Button
                        variant={active ? 'default' : 'outline'}
                        className="w-full"
                        asChild
                      >
                        <Link href="/login">{plan.cta}</Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
              );
            })}
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Billing FAQ</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Can I cancel anytime?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Yes. You can cancel your PayPal subscription at any time from your PayPal
                  account or from your SnapOG dashboard. Your plan will remain active until
                  the end of the billing period.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">How does billing work?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  We use PayPal Subscriptions for recurring billing. You&apos;ll be charged
                  monthly to your PayPal account. You can manage your subscription directly
                  through PayPal.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">What happens if I exceed my limit?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Requests beyond your plan limit will return a 429 error. We&apos;ll never charge
                  you extra — just upgrade to a higher plan if you need more.
                </CardContent>
              </Card>
          </div>
        </div>

        {/* Product Features Section */}
        <div className="mt-24 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Everything You Need for Perfect OG Images</h2>
          <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
            SnapOG takes care of the design work so you can focus on your content.
            Beautiful, consistent social previews — without hiring a designer.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4 p-6 rounded-xl border border-border bg-background hover:border-primary/40 transition-colors">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Generate in Seconds</h3>
                <p className="text-sm text-muted-foreground">
                  Paste any URL and SnapOG extracts title, description, and favicon automatically.
                  Your OG image is ready before your coffee cools down.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-xl border border-border bg-background hover:border-primary/40 transition-colors">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">10 Professional Templates</h3>
                <p className="text-sm text-muted-foreground">
                  From minimal blogs to startup launches — pick a template and customize colors,
                  fonts, logo, and every text field to match your brand.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-xl border border-border bg-background hover:border-primary/40 transition-colors">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Powerful API Access</h3>
                <p className="text-sm text-muted-foreground">
                  Pro and Business plans include API access so you can generate OG images
                  programmatically — perfect for blogs, documentation, and SaaS dashboards.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-xl border border-border bg-background hover:border-primary/40 transition-colors">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Works with Any Platform</h3>
                <p className="text-sm text-muted-foreground">
                  Next.js, Ghost, WordPress, Notion — if it supports og:image meta tags,
                  SnapOG works with it. Drop in the URL and you are done.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center rounded-2xl bg-primary/5 border border-primary/20 py-14 px-8">
            <h3 className="text-2xl font-bold mb-3">Ready to level up your social previews?</h3>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Start for free — no credit card required. Upgrade anytime when you need more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/editor"
                className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold px-8 py-3 text-sm hover:bg-primary/90 transition-colors"
              >
                Try the Editor Free
              </Link>
              <Link
                href="/#features"
                className="inline-flex items-center justify-center rounded-lg border border-border font-semibold px-8 py-3 text-sm hover:border-primary/50 transition-colors"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
      <Footer />
    </>
  );
}
