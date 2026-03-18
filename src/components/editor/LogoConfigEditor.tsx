'use client';

import { useEditorStore } from '@/store/editor';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';
import type { LogoConfig } from '@/types';

export const LogoConfigEditor = () => {
  const { params, setParam } = useEditorStore();
  const config = params.logoConfig || { size: 32, shape: 'rounded' };

  const updateConfig = (patch: Partial<LogoConfig>) => {
    setParam('logoConfig', { ...config, ...patch });
  };

  const resetConfig = () => {
    setParam('logoConfig', { size: 32, shape: 'rounded' });
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-muted/10 p-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Logo Style</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetConfig}
          className="h-6 px-2 text-xs text-muted-foreground"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Size control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Size</Label>
          <span className="text-xs text-muted-foreground">{config.size}px</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={16}
            max={128}
            step={4}
            value={config.size || 32}
            onChange={(e) => updateConfig({ size: Number(e.target.value) })}
            className="flex-1 accent-primary h-1"
          />
          <Input
            type="number"
            value={config.size || 32}
            onChange={(e) => {
              const val = Math.max(16, Math.min(128, Number(e.target.value)));
              updateConfig({ size: val });
            }}
            className="w-12 h-7 text-xs"
            min={16}
            max={128}
          />
        </div>
        <p className="text-xs text-muted-foreground">16 - 128 pixels</p>
      </div>

      {/* Shape control */}
      <div className="space-y-2">
        <Label className="text-xs">Shape</Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'square', label: '◻ Square', desc: 'Sharp corners' },
            { id: 'rounded', label: '⬜ Rounded', desc: 'Slightly rounded' },
            { id: 'circle', label: '⭕ Circle', desc: 'Fully circular' },
          ].map((shape) => (
            <button
              key={shape.id}
              onClick={() => updateConfig({ shape: shape.id as any })}
              className={cn(
                'rounded border-2 p-2 text-center transition-all text-xs',
                config.shape === shape.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className="font-medium">{shape.label}</div>
              <div className="text-xs text-muted-foreground">{shape.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      {params.logoUrl && (
        <div className="space-y-2 pt-2 border-t border-border">
          <p className="text-xs font-medium text-foreground">Preview</p>
          <div className="flex justify-center p-3 bg-background rounded border border-border">
            <img
              src={params.logoUrl}
              alt="Logo preview"
              className={cn(
                'object-contain',
                config.shape === 'circle' && 'rounded-full',
                config.shape === 'rounded' && 'rounded-lg',
                config.shape === 'square' && 'rounded-sm'
              )}
              style={{
                width: `${config.size}px`,
                height: `${config.size}px`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
