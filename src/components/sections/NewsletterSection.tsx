"use client";

import { Button } from '@/components/ui/Button';

export default function NewsletterSection() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8 border-t border-gray-100">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-neutral-text)] sm:text-4xl mb-4">
          Ready to land your dream job?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of job seekers who are applying smarter, not harder. Start tracking and optimizing today.
        </p>
        
        <form className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto w-full px-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full sm:flex-1 h-12 rounded-[var(--radius-base)] border border-gray-300 px-4 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            required
          />
          <Button type="submit" size="lg" className="w-full sm:w-auto h-12 whitespace-nowrap flex-shrink-0">
            Get Started Free
          </Button>
        </form>
        <p className="text-xs text-gray-400 mt-4">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
