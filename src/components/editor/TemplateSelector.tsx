'use client';

import { useEditorStore } from '@/store/editor';
import { TEMPLATE_LABELS } from '@/lib/og/templates';
import type { TemplateId } from '@/types';
import { cn } from '@/lib/utils';

const templateIds: TemplateId[] = [
  'tech-dark',
  'tech-light',
  'blog-clean',
  'blog-card',
  'gradient-1',
  'gradient-2',
  'minimal-dark',
  'minimal-light',
  'startup',
  'code-style',
];

const templatePreviewStyles: Record<TemplateId, { bg: string; text: string }> = {
  'tech-dark': { bg: '#0f0f0f', text: '#ffffff' },
  'tech-light': { bg: '#ffffff', text: '#111827' },
  'blog-clean': { bg: '#ffffff', text: '#000000' },
  'blog-card': { bg: '#f3f4f6', text: '#111827' },
  'gradient-1': { bg: 'linear-gradient(135deg, #667eea, #764ba2)', text: '#ffffff' },
  'gradient-2': { bg: 'linear-gradient(135deg, #f093fb, #f5576c)', text: '#ffffff' },
  'minimal-dark': { bg: '#1a1a2e', text: '#ffffff' },
  'minimal-light': { bg: '#fafafa', text: '#111827' },
  startup: { bg: '#0a0a0a', text: '#ffffff' },
  'code-style': { bg: '#0d1117', text: '#27c93f' },
};

export const TemplateSelector = () => {
  const { params, setParam } = useEditorStore();

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Template</label>
      <div className="grid grid-cols-2 gap-2">
        {templateIds.map((id) => {
          const style = templatePreviewStyles[id];
          const isSelected = params.template === id;

          return (
            <button
              key={id}
              onClick={() => setParam('template', id)}
              className={cn(
                'relative rounded-lg overflow-hidden border-2 transition-all text-left',
                isSelected
                  ? 'border-primary shadow-md'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div
                className="w-full aspect-[1200/630] flex items-end p-2"
                style={{ background: style.bg }}
              >
                <span
                  className="text-xs font-medium truncate"
                  style={{ color: style.text }}
                >
                  {TEMPLATE_LABELS[id]}
                </span>
              </div>
              {isSelected && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
