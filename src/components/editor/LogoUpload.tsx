'use client';

import { useState, useRef } from 'react';
import { useEditorStore } from '@/store/editor';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ImageIcon, X, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoConfigEditor } from './LogoConfigEditor';

// Image validation
const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'];
const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const RECOMMENDED_SIZE = '512x512px or larger';
const MIN_DIMENSIONS = 32; // minimum recommended

interface ValidationError {
  code: string;
  message: string;
}

const validateImage = (file: File): ValidationError | null => {
  // Check size
  if (file.size > MAX_SIZE_BYTES) {
    return {
      code: 'FILE_TOO_LARGE',
      message: `File size must be less than ${MAX_SIZE_MB}MB (current: ${(file.size / 1024 / 1024).toFixed(1)}MB)`,
    };
  }

  // Check type
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    return {
      code: 'UNSUPPORTED_FORMAT',
      message: `Unsupported format: ${file.type || 'unknown'}. Supported: PNG, JPEG, WebP, SVG, GIF`,
    };
  }

  return null;
};

const validateImageDimensions = (img: HTMLImageElement): ValidationError | null => {
  const { width, height } = img;
  if (width < MIN_DIMENSIONS || height < MIN_DIMENSIONS) {
    return {
      code: 'IMAGE_TOO_SMALL',
      message: `Image dimensions too small: ${width}x${height}px. Recommended minimum: ${MIN_DIMENSIONS}x${MIN_DIMENSIONS}px`,
    };
  }
  return null;
};

export const LogoUpload = () => {
  const { params, setParam } = useEditorStore();
  const [inputMode, setInputMode] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileValidationAndUpload = (file: File) => {
    // Validate file
    const error = validateImage(file);
    if (error) {
      toast({
        title: 'Invalid image',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const dataUrl = evt.target?.result as string;

        // Validate dimensions by loading the image
        const img = new Image();
        img.onload = () => {
          const dimError = validateImageDimensions(img);
          if (dimError) {
            toast({
              title: 'Image dimensions warning',
              description: dimError.message,
              variant: 'destructive',
            });
            setUploading(false);
            return;
          }

          // Success
          setParam('logoUrl', dataUrl);
          toast({
            title: 'Logo uploaded successfully',
            description: `Dimensions: ${img.width}x${img.height}px`,
          });
          setUploading(false);
        };

        img.onerror = () => {
          toast({
            title: 'Invalid image',
            description: 'Failed to load image. Please ensure the file is a valid image format.',
            variant: 'destructive',
          });
          setUploading(false);
        };

        img.src = dataUrl;
      } catch (err) {
        toast({
          title: 'Upload failed',
          description: 'Failed to process the image. Please try again.',
          variant: 'destructive',
        });
        setUploading(false);
      }
    };

    reader.onerror = () => {
      toast({
        title: 'Upload failed',
        description: 'Failed to read the file. Please check the file and try again.',
        variant: 'destructive',
      });
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileValidationAndUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileValidationAndUpload(file);
    }
  };

  const clearLogo = () => {
    setParam('logoUrl', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: 'Logo removed',
      description: 'Your logo has been cleared.',
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Logo / Icon</Label>
        <p className="text-xs text-muted-foreground mt-1">
          Formats: PNG, JPEG, WebP, SVG, GIF • Max {MAX_SIZE_MB}MB • {RECOMMENDED_SIZE}
        </p>
      </div>

      <div className="flex gap-2 mb-3">
        <Button
          variant={inputMode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setInputMode('url')}
        >
          URL
        </Button>
        <Button
          variant={inputMode === 'upload' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setInputMode('upload')}
        >
          Upload
        </Button>
      </div>

      {inputMode === 'url' ? (
        <Input
          value={params.logoUrl || ''}
          onChange={(e) => setParam('logoUrl', e.target.value)}
          placeholder="https://example.com/logo.png"
          type="url"
        />
      ) : (
        <>
          {/* Drag and drop area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={cn(
              'rounded-lg border-2 border-dashed p-6 text-center transition-all',
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 bg-muted/20'
            )}
          >
            <label className="cursor-pointer block">
              <div className="flex flex-col items-center gap-2">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                  dragOver ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  {dragOver ? <Upload className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {uploading ? 'Uploading...' : 'Drag image here or click to select'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max {MAX_SIZE_MB}MB • {RECOMMENDED_SIZE}
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={SUPPORTED_FORMATS.join(',')}
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </div>

          {/* Format guide */}
          <div className="rounded-lg bg-muted/30 p-3 space-y-1 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Recommended formats:</p>
                <p className="text-muted-foreground">PNG or WebP (supports transparency)</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Size requirements:</p>
                <p className="text-muted-foreground">At least 32x32px, preferably square</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Logo preview */}
      {params.logoUrl && (
        <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">Logo preview</p>
              <p className="text-xs text-muted-foreground truncate">
                {params.logoUrl.startsWith('data:') 
                  ? 'Uploaded image' 
                  : params.logoUrl}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 shrink-0" 
              onClick={clearLogo}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          <img
            src={params.logoUrl}
            alt="Logo preview"
            className="h-20 w-20 object-contain rounded border border-border bg-background"
            onError={() => {
              toast({
                title: 'Image failed to load',
                description: 'Please check the URL and try again.',
                variant: 'destructive',
              });
              clearLogo();
            }}
          />

          {/* Logo style editor */}
          <LogoConfigEditor />
        </div>
      )}
    </div>
  );
};
