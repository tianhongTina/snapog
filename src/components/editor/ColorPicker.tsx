'use client';

import { useEditorStore } from '@/store/editor';
import { Label } from '@/components/ui/label';

const presetColors = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#ffffff', '#000000', '#1f2937', '#6b7280',
];

type ColorParamKey = 'primaryColor' | 'backgroundColor';

interface ColorFieldProps {
  label: string;
  hint: string;
  paramKey: ColorParamKey;
}

const ColorField = ({ label, hint, paramKey }: ColorFieldProps) => {
  const { params, setParam } = useEditorStore();
  const value = params[paramKey] || '';
  const swatchValue = value || '#888888';

  return (
    <div className="space-y-1.5">
      <div>
        <Label>{label}</Label>
        <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={swatchValue}
          onChange={(e) => setParam(paramKey, e.target.value)}
          className="w-10 h-10 rounded border border-input cursor-pointer p-0.5 shrink-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setParam(paramKey, e.target.value)}
          className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="template default"
        />
        {value && (
          <button
            type="button"
            onClick={() => setParam(paramKey, '')}
            className="text-xs text-muted-foreground hover:text-foreground px-1 shrink-0"
            title="Reset to template default"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export const ColorPicker = () => {
  const { setParam } = useEditorStore();

  return (
    <div className="space-y-5">
      <ColorField
        label="Primary Color"
        hint="Accent color for borders, icons, and decorative elements"
        paramKey="primaryColor"
      />
      <ColorField
        label="Background Color"
        hint="Overall canvas background color"
        paramKey="backgroundColor"
      />

      {/* Per-field text color note */}
      <div className="rounded-lg bg-muted/40 border border-border p-3 text-xs text-muted-foreground">
        Text color can be set per-field in the <strong className="text-foreground">Text</strong> tab → Style section.
      </div>

      <div className="space-y-2">
        <Label>Preset Primary Colors</Label>
        <div className="flex flex-wrap gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              onClick={() => setParam('primaryColor', color)}
              className="w-7 h-7 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform ring-1 ring-border"
              style={{ background: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
