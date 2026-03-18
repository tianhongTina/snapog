'use client';

import { useEditorStore } from '@/store/editor';
import { Label } from '@/components/ui/label';
import type { FontId } from '@/types';
import { cn } from '@/lib/utils';

const fonts: { id: FontId; label: string; sample: string }[] = [
  { id: 'inter', label: 'Inter', sample: 'Clean & Modern' },
  { id: 'roboto', label: 'Roboto', sample: 'Friendly & Open' },
  { id: 'playfair', label: 'Playfair', sample: 'Elegant & Classic' },
  { id: 'mono', label: 'Mono', sample: 'Code & Technical' },
];

export const FontSelector = () => {
  const { params, setParam } = useEditorStore();

  return (
    <div className="space-y-3">
      <Label>Font Family</Label>
      <div className="grid grid-cols-2 gap-2">
        {fonts.map((font) => {
          const isSelected = params.font === font.id;
          return (
            <button
              key={font.id}
              onClick={() => setParam('font', font.id)}
              className={cn(
                'p-3 rounded-lg border-2 text-left transition-all',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className="font-semibold text-sm">{font.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{font.sample}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
