'use client';

import { useEditorStore } from '@/store/editor';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const POSITIONS = [
  { id: 'bottom-right', label: 'Bottom Right' },
  { id: 'bottom-left', label: 'Bottom Left' },
  { id: 'bottom-center', label: 'Bottom Center' },
  { id: 'tile', label: 'Tiled' },
] as const;

export const WatermarkEditor = () => {
  const { params, setParam } = useEditorStore();
  const wm = params.watermarkConfig || { enabled: true, text: 'Made with SnapOG', position: 'bottom-right', opacity: 0.6 };

  const update = (patch: Partial<typeof wm>) => {
    setParam('watermarkConfig', { ...wm, ...patch });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Watermark</Label>
        <button
          type="button"
          onClick={() => update({ enabled: !wm.enabled })}
          className={cn(
            'relative inline-flex items-center w-10 h-6 rounded-full transition-colors shrink-0',
            wm.enabled ? 'bg-primary' : 'bg-muted-foreground/30'
          )}
        >
          <span
            className={cn(
              'absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200',
              wm.enabled ? 'translate-x-4' : 'translate-x-0'
            )}
          />
        </button>
      </div>

      {wm.enabled && (
        <div className="rounded-lg border border-border bg-muted/10 p-3 space-y-3 overflow-hidden">
          {/* Custom text */}
          <div className="space-y-1.5">
            <Label className="text-xs">Watermark Text</Label>
            <Input
              value={wm.text || ''}
              onChange={(e) => update({ text: e.target.value })}
              placeholder="Made with SnapOG"
              maxLength={40}
            />
          </div>

          {/* Position */}
          <div className="space-y-1.5">
            <Label className="text-xs">Position</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {POSITIONS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => update({ position: p.id })}
                  className={cn(
                    'px-2 py-1.5 rounded border text-xs transition-all',
                    wm.position === p.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Opacity */}
          <div className="space-y-1.5">
            <Label className="text-xs">Opacity: {Math.round((wm.opacity ?? 0.6) * 100)}%</Label>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={Math.round((wm.opacity ?? 0.6) * 100)}
              onChange={(e) => update({ opacity: Number(e.target.value) / 100 })}
              className="w-full accent-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
};
