import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { hashApiKey } from '@/lib/utils';
import { PLAN_LIMITS } from '@/types';

export const runtime = 'edge';

// Internal endpoint to verify API keys (called from edge functions)
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const apiKey = request.headers.get('x-api-key');

  if (!apiKey) {
    return NextResponse.json({ error: 'No API key provided' }, { status: 401 });
  }

  const supabase = await createServiceClient();
  const keyHash = await hashApiKey(apiKey);

  // Look up the key
  const { data: keyRecord, error } = await supabase
    .from('api_keys')
    .select('id, user_id, is_active')
    .eq('key_hash', keyHash)
    .eq('is_active', true)
    .single();

  if (error || !keyRecord) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  // Update last_used_at
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', keyRecord.id);

  // Get user profile and plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', keyRecord.user_id)
    .single();

  const plan = (profile?.plan as 'free' | 'pro' | 'business') || 'free';
  const limits = PLAN_LIMITS[plan];

  return NextResponse.json({
    valid: true,
    userId: keyRecord.user_id,
    plan,
    watermark: limits.watermark,
  });
};
