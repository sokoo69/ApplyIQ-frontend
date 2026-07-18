import HeroSection from '@/components/sections/HeroSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import StatisticsSection from '@/components/sections/StatisticsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import BlogPreviewSection from '@/components/sections/BlogPreviewSection';
import FaqSection from '@/components/sections/FaqSection';
import NewsletterSection from '@/components/sections/NewsletterSection';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <StatisticsSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <FaqSection />
      <NewsletterSection />
    </div>
  );
}
