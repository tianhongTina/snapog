import { formatDate } from '@/lib/utils';
import { TEMPLATE_LABELS } from '@/lib/og/templates';
import type { OGHistory } from '@/types';

interface HistoryGridProps {
  history: OGHistory[];
}

export const HistoryGrid = ({ history }: HistoryGridProps) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
        <p>No history yet. Generate your first OG image!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {history.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow"
        >
          {item.preview_url ? (
            <img
              src={item.preview_url}
              alt={item.params.title}
              className="w-full aspect-[1200/630] object-cover"
            />
          ) : (
            <div className="w-full aspect-[1200/630] bg-muted flex items-center justify-center text-muted-foreground text-sm">
              No preview
            </div>
          )}
          <div className="p-3">
            <p className="font-medium text-sm truncate">{item.params.title}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">
                {TEMPLATE_LABELS[item.params.template] || item.params.template}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(item.created_at)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
