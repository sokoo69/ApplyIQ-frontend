import { ClipboardList, Cpu, Rocket } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Track',
    description: 'Save jobs from anywhere and track your application pipeline in a unified dashboard.',
    icon: <ClipboardList className="h-6 w-6 text-[var(--color-primary)]" />,
  },
  {
    id: 2,
    title: 'Analyze',
    description: 'Our AI scans your resume and the job description to find critical skill gaps before you apply.',
    icon: <Cpu className="h-6 w-6 text-[var(--color-accent)]" />,
  },
  {
    id: 3,
    title: 'Apply Smarter',
    description: 'Generate tailored cover letters and ace your interviews with our conversational AI coach.',
    icon: <Rocket className="h-6 w-6 text-[var(--color-secondary)]" />,
  }
];

export default function HowItWorksSection() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-neutral-text)] sm:text-4xl">
            How ApplyIQ Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            A seamless three-step process to land your dream job faster.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gray-100 z-0" />
          
          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white border-4 border-gray-50 shadow-sm mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed px-4">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
