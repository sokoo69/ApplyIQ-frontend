import { FileText, Bot, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const features = [
  {
    title: 'Cover Letter Generator',
    description: 'Instantly draft highly personalized cover letters that directly address the specific requirements of the job posting.',
    icon: <FileText className="h-8 w-8 text-[var(--color-primary)] mb-4" />
  },
  {
    title: 'Match Score Engine',
    description: 'Upload your resume and the job description to get a realistic compatibility score, complete with exact keyword recommendations.',
    icon: <Target className="h-8 w-8 text-[var(--color-secondary)] mb-4" />
  },
  {
    title: 'Interview Coach',
    description: 'Practice behavioral and technical questions in a live, conversational AI chat session tailored to the exact role you saved.',
    icon: <Bot className="h-8 w-8 text-[var(--color-accent)] mb-4" />
  }
];

export default function FeaturesSection() {
  return (
    <section className="bg-[var(--color-neutral-bg)] px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-neutral-text)] sm:text-4xl">
            AI-Powered Features
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Tools designed to give you an unfair advantage in the job market.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, idx) => (
            <Card key={idx} className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                {feature.icon}
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
