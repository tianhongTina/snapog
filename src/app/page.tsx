import { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TemplateGallery } from '@/components/landing/TemplateGallery';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';

export default function HomePage() {
  return (
    <>
      <Suspense fallback={
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-md border-b border-border" />
      }>
        <Navbar />
      </Suspense>
      <main>
        <HeroSection />
        <FeaturesSection />
        <TemplateGallery />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
