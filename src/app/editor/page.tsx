'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { EditorPanel } from '@/components/editor/EditorPanel';
import { PreviewArea } from '@/components/editor/PreviewArea';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/store/editor';
import { toast } from '@/components/ui/use-toast';
import { Download, Link2, RefreshCw, Zap, ChevronDown } from 'lucide-react';
import type { TemplateId } from '@/types';
import Link from 'next/link';

// Common OG / social image sizes
const PRESET_SIZES = [
  { label: 'OG Standard', w: 1200, h: 630 },
  { label: 'Twitter Card', w: 1200, h: 600 },
  { label: 'Facebook', w: 1200, h: 628 },
  { label: 'LinkedIn', w: 1200, h: 627 },
  { label: 'Square', w: 1200, h: 1200 },
  { label: 'Story (9:16)', w: 630, h: 1200 },
];

export default function EditorPage() {
  const searchParams = useSearchParams();
  const { params, setParam, setParams, setIsGenerating, setPreviewUrl, previewUrl } = useEditorStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const objectUrlRef = useRef<string>('');
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  const currentW = params.width || 1200;
  const currentH = params.height || 630;

  // Initialize from URL params
  useEffect(() => {
    const template = searchParams.get('template');
    if (template) setParam('template', template as TemplateId);
    const title = searchParams.get('title');
    if (title) setParam('title', title);
  }, [searchParams, setParam]);

  // Build API URL for copy (no dataURL logo)
  const buildApiUrl = useCallback(() => {
    const url = new URL('/api/og', window.location.origin);
    url.searchParams.set('template', params.template);
    url.searchParams.set('title', params.title || 'Untitled');
    if (params.description) url.searchParams.set('description', params.description);
    if (params.author) url.searchParams.set('author', params.author);
    if (params.date) url.searchParams.set('date', params.date);
    if (params.siteUrl) url.searchParams.set('siteUrl', params.siteUrl);
    if (params.logoUrl && !params.logoUrl.startsWith('data:')) url.searchParams.set('logoUrl', params.logoUrl);
    if (params.primaryColor) url.searchParams.set('primaryColor', params.primaryColor);
    if (params.backgroundColor) url.searchParams.set('backgroundColor', params.backgroundColor);
    if (params.textColor) url.searchParams.set('textColor', params.textColor);
    if (params.width && params.width !== 1200) url.searchParams.set('width', String(params.width));
    if (params.height && params.height !== 630) url.searchParams.set('height', String(params.height));
    if (params.titleStyle) url.searchParams.set('titleStyle', JSON.stringify(params.titleStyle));
    if (params.descriptionStyle) url.searchParams.set('descriptionStyle', JSON.stringify(params.descriptionStyle));
    if (params.authorStyle) url.searchParams.set('authorStyle', JSON.stringify(params.authorStyle));
    if (params.watermarkConfig) url.searchParams.set('watermarkConfig', JSON.stringify(params.watermarkConfig));
    if (params.logoConfig) url.searchParams.set('logoConfig', JSON.stringify(params.logoConfig));
    url.searchParams.set('watermark', 'true');
    return url.toString();
  }, [params]);

  const generatePreview = useCallback(async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/og', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, watermark: true }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || err.error || 'Generation failed');
      }

      const blob = await response.blob();

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      const newUrl = URL.createObjectURL(blob);
      objectUrlRef.current = newUrl;
      setPreviewUrl(newUrl);
    } catch (err) {
      console.error('Preview error:', err);
      toast({
        title: 'Preview failed',
        description: String(err instanceof Error ? err.message : 'Please check your settings.'),
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [params, setIsGenerating, setPreviewUrl]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(generatePreview, 400);
    return () => clearTimeout(debounceRef.current);
  }, [generatePreview]);

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/og', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, watermark: false }),
      });
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `og-${params.template}-${currentW}x${currentH}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: 'Downloaded!', description: `${currentW}×${currentH} PNG saved.` });
    } catch {
      toast({ title: 'Download failed', variant: 'destructive' });
    }
  };

  const handleCopyApiUrl = () => {
    navigator.clipboard.writeText(buildApiUrl()).then(() => {
      toast({ title: 'API URL Copied!', description: 'Paste into your og:image meta tag.' });
    });
  };

  const applyPreset = (w: number, h: number) => {
    setParams({ width: w, height: h });
    setShowSizeDropdown(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0 gap-4">
        {/* Left: branding */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            SnapOG
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Editor</span>
        </div>

        {/* Center: size controls */}
        <div className="flex items-center gap-2 flex-1 justify-center">
          {/* Width input */}
          <div className="flex items-center gap-1 rounded-md border border-input bg-background overflow-hidden h-8">
            <span className="text-xs text-muted-foreground px-2 border-r border-input">W</span>
            <input
              type="number"
              value={currentW}
              onChange={(e) => setParam('width', Math.max(400, Math.min(2400, Number(e.target.value))))}
              className="w-16 h-full text-xs text-center bg-transparent focus:outline-none focus:ring-1 focus:ring-ring"
              min={400}
              max={2400}
            />
          </div>
          <span className="text-xs text-muted-foreground">×</span>
          {/* Height input */}
          <div className="flex items-center gap-1 rounded-md border border-input bg-background overflow-hidden h-8">
            <span className="text-xs text-muted-foreground px-2 border-r border-input">H</span>
            <input
              type="number"
              value={currentH}
              onChange={(e) => setParam('height', Math.max(200, Math.min(1260, Number(e.target.value))))}
              className="w-16 h-full text-xs text-center bg-transparent focus:outline-none focus:ring-1 focus:ring-ring"
              min={200}
              max={1260}
            />
          </div>
          {/* Preset dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs gap-1"
              onClick={() => setShowSizeDropdown(!showSizeDropdown)}
            >
              Presets
              <ChevronDown className="h-3 w-3" />
            </Button>
            {showSizeDropdown && (
              <div className="absolute top-full mt-1 left-0 z-50 bg-background border border-border rounded-lg shadow-lg py-1 min-w-[160px]">
                {PRESET_SIZES.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p.w, p.h)}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent transition-colors flex items-center justify-between gap-4"
                  >
                    <span>{p.label}</span>
                    <span className="text-muted-foreground">{p.w}×{p.h}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleCopyApiUrl}>
            <Link2 className="h-4 w-4 mr-1.5" />
            Copy API URL
          </Button>
          <Button variant="outline" size="sm" onClick={generatePreview}>
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleDownload} disabled={!previewUrl}>
            <Download className="h-4 w-4 mr-1.5" />
            Download PNG
          </Button>
        </div>
      </header>

      {/* Close size dropdown when clicking outside */}
      {showSizeDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSizeDropdown(false)}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 shrink-0 border-r border-border overflow-hidden flex flex-col">
          <EditorPanel />
        </div>
        <div className="flex-1 p-6 overflow-auto">
          <PreviewArea />
        </div>
      </div>
    </div>
  );
}
