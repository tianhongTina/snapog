'use client';

import { useState } from 'react';
import { TemplateSelector } from './TemplateSelector';
import { TextEditor } from './TextEditor';
import { ColorPicker } from './ColorPicker';
import { LogoUpload } from './LogoUpload';
import { WatermarkEditor } from './WatermarkEditor';
import { cn } from '@/lib/utils';

type Tab = 'template' | 'text' | 'style' | 'logo';

const tabs: { id: Tab; label: string }[] = [
  { id: 'template', label: 'Template' },
  { id: 'text', label: 'Text' },
  { id: 'style', label: 'Style' },
  { id: 'logo', label: 'Logo' },
];

export const EditorPanel = () => {
  const [activeTab, setActiveTab] = useState<Tab>('template');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 py-2.5 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'border-b-2 border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'template' && <TemplateSelector />}
        {activeTab === 'text' && <TextEditor />}
        {activeTab === 'style' && (
          <div className="space-y-6">
            <ColorPicker />
            <div className="border-t border-border pt-6">
              <WatermarkEditor />
            </div>
          </div>
        )}
        {activeTab === 'logo' && <LogoUpload />}
      </div>
    </div>
  );
};
