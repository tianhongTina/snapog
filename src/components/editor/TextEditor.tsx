'use client';

import { useState } from 'react';
import { useEditorStore } from '@/store/editor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Palette, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FontId, TextStyle } from '@/types';

const FONTS: { id: FontId; label: string }[] = [
  { id: 'inter', label: 'Inter' },
  { id: 'roboto', label: 'Roboto' },
  { id: 'playfair', label: 'Playfair' },
  { id: 'mono', label: 'Mono' },
];

const PRESET_COLORS = [
  '#ffffff', '#000000', '#f3f4f6', '#1f2937',
  '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#22c55e', '#06b6d4', '#f59e0b',
];

interface FieldStyleEditorProps {
  label: string;
  style?: TextStyle;
  onChange: (style: TextStyle) => void;
}

const FieldStyleEditor = ({ label, style = {}, onChange }: FieldStyleEditorProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Palette className="h-3 w-3" />
        <Type className="h-3 w-3" />
        <span>Style</span>
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {open && (
        <div className="mt-2 p-3 rounded-lg border border-border bg-muted/20 space-y-3">
          {/* Color */}
          <div className="space-y-1.5">
            <Label className="text-xs">Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={style.color || '#000000'}
                onChange={(e) => onChange({ ...style, color: e.target.value })}
                className="w-8 h-8 rounded border border-input cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={style.color || ''}
                onChange={(e) => onChange({ ...style, color: e.target.value })}
                placeholder="inherit"
                className="flex-1 h-8 rounded border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => onChange({ ...style, color: c })}
                  className={cn(
                    'w-5 h-5 rounded-full border border-white/20 ring-1 ring-border hover:scale-110 transition-transform',
                    style.color === c && 'ring-2 ring-primary'
                  )}
                  style={{ background: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Font */}
          <div className="space-y-1.5">
            <Label className="text-xs">Font</Label>
            <div className="flex flex-wrap gap-1.5">
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onChange({ ...style, font: f.id })}
                  className={cn(
                    'px-2.5 py-1 rounded text-xs border transition-all',
                    style.font === f.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const TextEditor = () => {
  const { params, setParam } = useEditorStore();

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={params.title}
          onChange={(e) => setParam('title', e.target.value)}
          placeholder="Enter your title"
          maxLength={120}
        />
        <p className="text-xs text-muted-foreground">{params.title.length}/120</p>
        <FieldStyleEditor
          label="Title Style"
          style={params.titleStyle}
          onChange={(s) => setParam('titleStyle', s)}
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={params.description || ''}
          onChange={(e) => setParam('description', e.target.value)}
          placeholder="Enter a short description"
          maxLength={200}
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
        />
        <p className="text-xs text-muted-foreground">{(params.description || '').length}/200</p>
        <FieldStyleEditor
          label="Description Style"
          style={params.descriptionStyle}
          onChange={(s) => setParam('descriptionStyle', s)}
        />
      </div>

      {/* Author */}
      <div className="space-y-1.5">
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={params.author || ''}
          onChange={(e) => setParam('author', e.target.value)}
          placeholder="e.g. John Doe"
        />
        <FieldStyleEditor
          label="Author Style"
          style={params.authorStyle}
          onChange={(s) => setParam('authorStyle', s)}
        />
      </div>

      {/* Date */}
      <div className="space-y-1.5">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          value={params.date || ''}
          onChange={(e) => setParam('date', e.target.value)}
          placeholder="e.g. March 18, 2026"
        />
        <FieldStyleEditor
          label="Date Style"
          style={params.dateStyle}
          onChange={(s) => setParam('dateStyle', s)}
        />
      </div>

      {/* Site URL */}
      <div className="space-y-1.5">
        <Label htmlFor="siteUrl">Site Name</Label>
        <Input
          id="siteUrl"
          value={params.siteUrl || ''}
          onChange={(e) => setParam('siteUrl', e.target.value)}
          placeholder="e.g. myblog.com"
        />
        <FieldStyleEditor
          label="Site Name Style"
          style={params.siteUrlStyle}
          onChange={(s) => setParam('siteUrlStyle', s)}
        />
      </div>

      {/* Vertical domain fields - shown only for relevant templates */}
      {(params.template === 'tech-blog' || params.template === 'ecommerce' || params.template === 'saas-product') && (
        <div className="border-t border-border pt-5 space-y-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Template-specific Fields
          </div>

          {/* Badge (tech-blog + ecommerce + saas-product) */}
          <div className="space-y-1.5">
            <Label htmlFor="badge">
              {params.template === 'tech-blog' ? 'Badge (e.g., #TypeScript)' :
               params.template === 'ecommerce' ? 'Badge (e.g., NEW, SALE)' :
               'Badge (e.g., SaaS, v2.0)'}
            </Label>
            <Input
              id="badge"
              value={params.badge || ''}
              onChange={(e) => setParam('badge', e.target.value)}
              placeholder={
                params.template === 'tech-blog' ? '#TypeScript' :
                params.template === 'ecommerce' ? 'NEW' :
                'SaaS'
              }
              maxLength={30}
            />
          </div>

          {/* Price - ecommerce only */}
          {params.template === 'ecommerce' && (
            <div className="space-y-1.5">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={params.price || ''}
                onChange={(e) => setParam('price', e.target.value)}
                placeholder="$99 /mo"
                maxLength={20}
              />
            </div>
          )}

          {/* Metrics - saas-product only */}
          {params.template === 'saas-product' && (
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground">Metrics displayed at the bottom (max 3 items)</div>
              {([1, 2, 3] as const).map((n) => {
                const labelKey = `metric${n}Label` as 'metric1Label' | 'metric2Label' | 'metric3Label';
                const valueKey = `metric${n}Value` as 'metric1Value' | 'metric2Value' | 'metric3Value';
                return (
                  <div key={n} className="flex gap-2 items-center">
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground shrink-0">{n}</div>
                    <Input
                      value={params[labelKey] || ''}
                      onChange={(e) => setParam(labelKey, e.target.value)}
                      placeholder={n === 1 ? 'Active Users' : n === 2 ? 'Uptime' : 'Speed'}
                      maxLength={20}
                      className="flex-1"
                    />
                    <Input
                      value={params[valueKey] || ''}
                      onChange={(e) => setParam(valueKey, e.target.value)}
                      placeholder={n === 1 ? '10K+' : n === 2 ? '99.9%' : '< 100ms'}
                      maxLength={15}
                      className="w-24 shrink-0"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
