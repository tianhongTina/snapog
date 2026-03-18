import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is an Open Graph image?',
    answer:
      'An Open Graph (OG) image is the preview image that appears when you share a link on social media platforms like Twitter, Facebook, LinkedIn, or Slack. It\'s the image shown in the "card" preview. SnapOG helps you create beautiful, consistent OG images for all your pages.',
  },
  {
    question: 'How does the API work?',
    answer:
      'The SnapOG API is a simple HTTP endpoint. You pass parameters like template, title, description, and other options as URL query parameters. The API returns a PNG image that you can use directly as your og:image meta tag value.',
  },
  {
    question: 'Do I need to sign up to use the editor?',
    answer:
      'No! The visual editor is available for free without signing up. You can design and preview your OG images right away. You only need an account to use the API or to remove the watermark.',
  },
  {
    question: 'What\'s included in the free plan?',
    answer:
      '50 API requests per month, access to 3 templates, and the visual editor. Free plan images include a small SnapOG watermark in the corner.',
  },
  {
    question: 'How fast is image generation?',
    answer:
      'Image generation runs on Vercel Edge Functions globally, typically completing in under 50ms. Since it\'s an edge function, it runs close to your users for minimal latency.',
  },
  {
    question: 'Can I use custom fonts or colors?',
    answer:
      'Pro and Business plans include custom font selection and color customization through the API parameters. Free plan uses our default Inter font.',
  },
  {
    question: 'How does PayPal billing work?',
    answer:
      'We use PayPal Subscriptions for billing. You\'ll be billed monthly to your PayPal account. You can cancel anytime from your dashboard or directly through PayPal.',
  },
  {
    question: 'Is there a rate limit?',
    answer:
      'Yes, rate limits are based on your plan: Free (50/month), Pro (1,000/month), Business (10,000/month). If you need more, contact us for a custom plan.',
  },
];

export const FAQSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about SnapOG.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
