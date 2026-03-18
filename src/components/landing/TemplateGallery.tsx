import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const templates = [
  {
    id: 'tech-dark',
    name: 'Tech Dark',
    bg: '#0f0f0f',
    accent: '#00ff88',
    textColor: '#ffffff',
    subtextColor: '#888888',
  },
  {
    id: 'gradient-1',
    name: 'Gradient Purple',
    bg: 'linear-gradient(135deg, #667eea, #764ba2)',
    accent: 'rgba(255,255,255,0.3)',
    textColor: '#ffffff',
    subtextColor: 'rgba(255,255,255,0.7)',
  },
  {
    id: 'gradient-2',
    name: 'Gradient Pink',
    bg: 'linear-gradient(135deg, #f093fb, #f5576c)',
    accent: 'rgba(255,255,255,0.2)',
    textColor: '#ffffff',
    subtextColor: 'rgba(255,255,255,0.8)',
  },
  {
    id: 'blog-clean',
    name: 'Blog Clean',
    bg: '#ffffff',
    accent: '#000000',
    textColor: '#000000',
    subtextColor: '#6b7280',
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    bg: '#1a1a2e',
    accent: '#e94560',
    textColor: '#ffffff',
    subtextColor: '#a0a0b8',
  },
  {
    id: 'startup',
    name: 'Startup',
    bg: '#0a0a0a',
    accent: '#6366f1',
    textColor: '#ffffff',
    subtextColor: '#9ca3af',
  },
];

export const TemplateGallery = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">10 Stunning Templates</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Each template is carefully designed to look great across all social platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all group cursor-pointer"
            >
              {/* Template preview */}
              <div
                className="w-full aspect-[1200/630] p-4 flex flex-col justify-center"
                style={{ background: template.bg }}
              >
                <div
                  className="text-xs mb-1"
                  style={{ color: template.accent, fontFamily: 'monospace' }}
                >
                  {template.id}
                </div>
                <div
                  className="text-lg font-bold leading-tight"
                  style={{ color: template.textColor }}
                >
                  My Awesome Blog Post
                </div>
                <div className="text-xs mt-1" style={{ color: template.subtextColor }}>
                  A short description goes here
                </div>
              </div>
              {/* Name */}
              <div className="p-3 bg-background border-t border-border flex items-center justify-between">
                <span className="text-sm font-medium">{template.name}</span>
                <Link
                  href={`/editor?template=${template.id}`}
                  className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Use this →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/editor">
              Open Editor
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
