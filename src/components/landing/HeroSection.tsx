import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';

export const HeroSection = () => {
  const previewUrl = '/api/og?template=tech-dark&title=Beautiful+OG+Images%2C+In+Seconds&description=No+design+skills+needed.+Pick+a+template%2C+add+your+text.&siteUrl=snapog.com&primaryColor=%2300ff88';

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
          <Zap className="h-4 w-4" />
          Generate OG Images in Seconds
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto">
          Beautiful{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
            Open Graph
          </span>{' '}
          Images for Your Website
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Stop using boring screenshots. SnapOG generates stunning social share images
          with a simple API call. 10 beautiful templates, zero design skills needed.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="text-base px-8" asChild>
            <Link href="/editor">
              Try the Editor Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base px-8" asChild>
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-12 text-center mb-16">
          {[
            { value: '10', label: 'Beautiful Templates' },
            { value: '50+', label: 'Free Requests/Month' },
            { value: '<200ms', label: 'Generation Time' },
            { value: '1200×630', label: 'Perfect OG Size' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Real OG Image Preview */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-border">
            {/* Browser chrome */}
            <div className="bg-muted px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 bg-background rounded px-3 py-1 text-xs text-muted-foreground text-left truncate">
                snapog.com/api/og?template=tech-dark&title=Beautiful+OG+Images
              </div>
            </div>
            {/* Actual generated image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="SnapOG demo preview"
              className="w-full"
              style={{ aspectRatio: '1200/630', display: 'block' }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            ↑ This image is generated live by SnapOG
          </p>
        </div>
      </div>
    </section>
  );
};
