import { Card, CardContent } from '@/components/ui/Card';

const testimonials = [
  {
    quote: "ApplyIQ's Match Score Engine pointed out exactly which React concepts I was missing on my resume. I tweaked it and got an interview the next day.",
    name: "Sarah Jenkins",
    role: "Frontend Developer"
  },
  {
    quote: "The Interview Coach felt incredibly real. I was nervous about behavioral questions, but after three sessions with the AI, I walked into the real interview completely confident.",
    name: "Marcus Thorne",
    role: "Product Manager"
  },
  {
    quote: "I used to track jobs in a messy spreadsheet. Having my applications, generated cover letters, and notes all in one dashboard has saved me hours.",
    name: "Elena Rodriguez",
    role: "UX Designer"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="bg-[var(--color-neutral-bg)] px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-neutral-text)] sm:text-4xl">
            Landed by ApplyIQ Users
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((test, idx) => (
            <Card key={idx} className="bg-white h-full flex flex-col justify-between hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex flex-col h-full justify-between">
                <p className="text-gray-600 italic mb-6">"{test.quote}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="h-10 w-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{test.name}</h4>
                    <p className="text-xs text-gray-500">{test.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
