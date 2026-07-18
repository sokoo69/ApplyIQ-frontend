"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const faqs = [
  {
    q: "Is ApplyIQ free to use?",
    a: "We offer a generous free tier that lets you track up to 20 active applications and generate 5 match scores per month. For power users, we have a Pro plan with unlimited AI features."
  },
  {
    q: "How accurate is the Match Score Engine?",
    a: "Our AI model analyzes your resume against the job description using advanced NLP, similar to enterprise Applicant Tracking Systems (ATS). It highlights exact missing keywords to improve your chances."
  },
  {
    q: "Can the Interview Coach simulate technical interviews?",
    a: "Yes! If you save a technical role (e.g., Software Engineer), the AI will ask domain-specific technical questions alongside standard behavioral ones."
  },
  {
    q: "Do I need to connect my email?",
    a: "No, ApplyIQ operates independently of your inbox. You manually track your pipeline stages or use our browser extension (coming soon) to save jobs."
  },
  {
    q: "Can I export my data?",
    a: "Yes, you can export your entire application pipeline to CSV at any time from your account settings."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-[var(--color-neutral-bg)] px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-neutral-text)] sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <Card key={idx} className="overflow-hidden border border-gray-200 shadow-sm transition-all duration-200">
              <button
                className="flex w-full items-center justify-between bg-white px-6 py-4 text-left focus:outline-none hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-semibold text-gray-900">{faq.q}</span>
                {openIndex === idx ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openIndex === idx && (
                <div className="bg-white px-6 pb-4 pt-0">
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
