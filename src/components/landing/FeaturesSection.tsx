import { Zap, Code2, Palette, Globe, Shield, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Edge-powered OG image generation delivers results in under 50ms, anywhere in the world.',
  },
  {
    icon: Code2,
    title: 'Simple API',
    description:
      'One URL, infinite possibilities. Just pass your parameters and get a perfect OG image back.',
  },
  {
    icon: Palette,
    title: '10 Templates',
    description:
      'From minimal to vibrant gradients, code-style to startup — a template for every brand.',
  },
  {
    icon: Globe,
    title: 'URL Extractor',
    description:
      'Paste any URL and automatically extract the title, description, and metadata.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description:
      'API keys, rate limiting, and Supabase authentication keep your account safe.',
  },
  {
    icon: BarChart3,
    title: 'Usage Analytics',
    description:
      'Track your monthly requests, manage API keys, and monitor usage from your dashboard.',
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            SnapOG combines a powerful editor, a fast API, and smart tooling to make
            social sharing beautiful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-background rounded-xl p-6 border border-border hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
