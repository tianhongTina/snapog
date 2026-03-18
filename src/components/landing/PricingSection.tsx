import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for personal projects and testing.',
    features: [
      '50 requests per month',
      '3 templates',
      'Watermark on images',
      'Visual editor',
      'URL extractor',
    ],
    cta: 'Get Started Free',
    href: '/editor',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'For developers and content creators.',
    features: [
      '1,000 requests per month',
      'All 10 templates',
      'No watermark',
      'API access',
      'Custom fonts',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    href: '/pricing',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Business',
    price: '$29',
    period: '/month',
    description: 'For teams and high-volume applications.',
    features: [
      '10,000 requests per month',
      'All 10 templates',
      'No watermark',
      'API access',
      'Custom fonts',
      'Team dashboard',
      'Priority support',
      'SLA guarantee',
    ],
    cta: 'Upgrade to Business',
    href: '/pricing',
    highlighted: false,
  },
];

export const PricingSection = () => {
  return (
    <section className="py-24 bg-muted/30" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start for free. Upgrade when you need more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 border ${
                plan.highlighted
                  ? 'border-primary bg-primary/5 shadow-xl scale-105'
                  : 'border-border bg-background'
              }`}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {plan.badge}
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.highlighted ? 'default' : 'outline'}
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
