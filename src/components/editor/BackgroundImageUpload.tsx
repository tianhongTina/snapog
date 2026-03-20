'use client';

import { useRef } from 'react';
import { useEditorStore } from '@/store/editor';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Upload, X, Image } from 'lucide-react';

const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const BackgroundImageUpload = () => {
  const { params, setParam, setParams } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasImage = !!params.backgroundImageUrl;
  const currentLayer = params.backgroundLayer || 'image';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: 'Format not supported',
        description: 'Please upload a JPEG, PNG, WebP, or GIF image.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      toast({
        title: 'File too large',
        description: `Image size cannot exceed ${MAX_SIZE_MB}MB. Current file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`,
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setParams({
        backgroundImageUrl: dataUrl,
        backgroundLayer: 'image',
      });
      toast({
        title: 'Background image uploaded',
        description: 'Image applied to preview. Switch between Image and Color mode in the toggle below.',
      });
    };
    reader.onerror = () => {
      toast({
        title: 'Read failed',
        description: 'Could not read the image file. Please try again.',
        variant: 'destructive',
      });
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be re-uploaded
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setParams({
      backgroundImageUrl: '',
      backgroundLayer: 'image',
    });
  };

  const handleLayerToggle = (layer: 'image' | 'color') => {
    setParam('backgroundLayer', layer);
  };

  const handleModeChange = (mode: 'cover' | 'contain' | 'fill') => {
    setParam('backgroundImageMode', mode);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Background Image</Label>
        <p className="text-xs text-muted-foreground mt-0.5">
          Upload a background image (max {MAX_SIZE_MB}MB, supports JPG/PNG/WebP)
        </p>
      </div>

      {!hasImage ? (
        /* Upload button */
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/60 flex flex-col items-center justify-center gap-1.5 transition-colors text-muted-foreground hover:text-foreground"
        >
          <Upload className="h-5 w-5" />
          <span className="text-xs font-medium">Click to upload background image</span>
        </button>
      ) : (
        /* Preview + controls */
        <div className="space-y-2">
          {/* Thumbnail */}
          <div className="relative w-full rounded-lg overflow-hidden border border-border bg-muted/30" style={{ aspectRatio: '1200/630' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={params.backgroundImageUrl}
              alt="Background preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              title="Remove background image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Replace button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Image className="h-3.5 w-3.5" />
            Replace image
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Layer toggle: only shown when image is uploaded */}
      {hasImage && (
        <div className="space-y-2">
          <Label className="text-xs">Background layer</Label>
          <div className="flex rounded-lg border border-border overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => handleLayerToggle('image')}
              className={`flex-1 py-1.5 font-medium transition-colors ${
                currentLayer === 'image'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              Image
            </button>
            <button
              type="button"
              onClick={() => handleLayerToggle('color')}
              className={`flex-1 py-1.5 font-medium transition-colors ${
                currentLayer === 'color'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              Color
            </button>
          </div>
        </div>
      )}

      {/* Image fit mode: only shown when showing image */}
      {hasImage && currentLayer === 'image' && (
        <div className="space-y-1.5">
          <Label className="text-xs">Image fit mode</Label>
          <div className="flex gap-1.5">
            {(['cover', 'contain', 'fill'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => handleModeChange(mode)}
                className={`flex-1 py-1 rounded text-xs font-medium border transition-colors ${
                  (params.backgroundImageMode || 'cover') === mode
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40'
                }`}
              >
                {mode === 'cover' ? 'Cover' : mode === 'contain' ? 'Contain' : 'Fill'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
