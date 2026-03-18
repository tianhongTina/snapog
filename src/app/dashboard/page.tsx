import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Key, History, ExternalLink, Pencil } from 'lucide-react';
import { getCurrentMonth } from '@/lib/utils';
import { PLAN_LIMITS } from '@/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const plan = (profile?.plan as 'free' | 'pro' | 'business') || 'free';
  const limits = PLAN_LIMITS[plan];

  // Get monthly usage
  const currentMonth = getCurrentMonth();
  const { data: usage } = await supabase
    .from('monthly_usage')
    .select('count')
    .eq('user_id', user.id)
    .eq('month', currentMonth)
    .single();

  const monthlyUsage = (usage?.count as number) || 0;

  // Get API key count
  const { count: apiKeyCount } = await supabase
    .from('api_keys')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_active', true);

  // Get history count
  const { count: historyCount } = await supabase
    .from('og_history')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user.email?.split('@')[0]}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={plan === 'free' ? 'secondary' : 'default'}>
            {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
          </Badge>
          <Button asChild>
            <Link href="/editor">
              <Pencil className="h-4 w-4 mr-2" />
              Open Editor
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatsCards
        monthlyUsage={monthlyUsage}
        monthlyLimit={limits.monthly_requests}
        apiKeyCount={apiKeyCount || 0}
        historyCount={historyCount || 0}
      />

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">API Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create and manage API keys to integrate OG image generation into your workflow.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/keys">
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage Keys
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Image History</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View all previously generated OG images and quickly reuse their settings.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/history">
                <ExternalLink className="h-4 w-4 mr-2" />
                View History
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Plan upgrade CTA for free users */}
      {plan === 'free' && (
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Upgrade to Pro</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Get 1,000 requests/month, no watermark, and API access for just $9/month.
              </p>
            </div>
            <Button asChild>
              <Link href="/pricing">Upgrade Now</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
