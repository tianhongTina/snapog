import { createClient } from '@/lib/supabase/server';
import { HistoryGrid } from '@/components/dashboard/HistoryGrid';
import type { OGHistory } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: history } = await supabase
    .from('og_history')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const typedHistory: OGHistory[] = (history || []).map((item) => ({
    id: item.id as string,
    user_id: item.user_id as string,
    params: item.params as OGHistory['params'],
    preview_url: item.preview_url as string | undefined,
    created_at: item.created_at as string,
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Generation History</h1>
        <p className="text-muted-foreground mt-1">
          Your most recently generated OG images (last 50).
        </p>
      </div>

      <HistoryGrid history={typedHistory} />
    </div>
  );
}
