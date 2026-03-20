import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/user/plan - returns the authenticated user's plan
export const GET = async (_request: NextRequest): Promise<NextResponse> => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ plan: 'free' }); // Default to free if profile not found
  }

  return NextResponse.json({ plan: profile?.plan || 'free' });
};
