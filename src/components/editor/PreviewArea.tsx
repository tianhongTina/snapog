'use client';

import { useEditorStore } from '@/store/editor';
import { Loader2 } from 'lucide-react';

const DEFAULT_W = 1200;
const DEFAULT_H = 630;

export const PreviewArea = () => {
  const { previewUrl, isGenerating, params } = useEditorStore();
  const w = params.width || DEFAULT_W;
  const h = params.height || DEFAULT_H;
  const ratio = `${w}/${h}`;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Preview ({w}×{h})
        </h2>
      </div>

      <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-xl border border-border overflow-hidden">
        {isGenerating ? (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-sm">Generating preview...</span>
          </div>
        ) : previewUrl ? (
          <div className="w-full p-4">
            <img
              src={previewUrl}
              alt="OG Image Preview"
              className="w-full rounded-lg shadow-lg border border-border object-contain"
              style={{ aspectRatio: ratio }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-sm">Your preview will appear here</span>
          </div>
        )}
      </div>
    </div>
  );
};
