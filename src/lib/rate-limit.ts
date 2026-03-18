import { createServiceClient } from '@/lib/supabase/server';
import { PLAN_LIMITS, type Plan, type RateLimitResult } from '@/types';
import { getCurrentMonth } from '@/lib/utils';

export const checkRateLimit = async (
  userId: string,
  plan: Plan
): Promise<RateLimitResult> => {
  const supabase = await createServiceClient();
  const currentMonth = getCurrentMonth();
  const limit = PLAN_LIMITS[plan].monthly_requests;

  // Get or create usage record for current month
  const { data: existing } = await supabase
    .from('monthly_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('month', currentMonth)
    .single();

  if (!existing) {
    // Create new record
    await supabase.from('monthly_usage').insert({
      user_id: userId,
      month: currentMonth,
      count: 0,
    });

    return {
      allowed: true,
      remaining: limit,
      limit,
      reset: getMonthReset(),
    };
  }

  const currentCount = existing.count as number;
  const allowed = currentCount < limit;

  if (allowed) {
    // Increment usage
    await supabase
      .from('monthly_usage')
      .update({ count: currentCount + 1, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('month', currentMonth);
  }

  return {
    allowed,
    remaining: Math.max(0, limit - currentCount - (allowed ? 1 : 0)),
    limit,
    reset: getMonthReset(),
  };
};

export const checkAnonymousRateLimit = async (ip: string): Promise<RateLimitResult> => {
  // Anonymous users get 5 requests per day based on IP
  // In production you'd use a Redis/KV store for this
  // Here we use a simplified in-memory approach or Supabase
  const supabase = await createServiceClient();
  const today = new Date().toISOString().split('T')[0];
  const limit = 5;

  const { data: existing } = await supabase
    .from('anonymous_usage')
    .select('*')
    .eq('ip', ip)
    .eq('date', today)
    .single();

  if (!existing) {
    await supabase.from('anonymous_usage').insert({
      ip,
      date: today,
      count: 1,
    });

    return {
      allowed: true,
      remaining: limit - 1,
      limit,
      reset: getDayReset(),
    };
  }

  const currentCount = existing.count as number;
  const allowed = currentCount < limit;

  if (allowed) {
    await supabase
      .from('anonymous_usage')
      .update({ count: currentCount + 1 })
      .eq('ip', ip)
      .eq('date', today);
  }

  return {
    allowed,
    remaining: Math.max(0, limit - currentCount - (allowed ? 1 : 0)),
    limit,
    reset: getDayReset(),
  };
};

const getMonthReset = (): string => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
};

const getDayReset = (): string => {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return tomorrow.toISOString();
};
