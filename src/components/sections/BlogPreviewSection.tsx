import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const posts = [
  {
    title: "How to Beat the ATS (Applicant Tracking System) in 2026",
    excerpt: "Learn how modern ATS algorithms rank resumes and what exact keywords you need to include.",
    category: "Career Advice",
    date: "Oct 12, 2026"
  },
  {
    title: "5 Behavioral Questions You're Guaranteed to Be Asked",
    excerpt: "Prepare for these common behavioral questions using the STAR method and our AI coach.",
    category: "Interview Prep",
    date: "Oct 10, 2026"
  },
  {
    title: "Why Tailoring Your Cover Letter is Non-Negotiable",
    excerpt: "Data shows that customized cover letters increase callback rates by 40%. Here's how to do it efficiently.",
    category: "Job Hunting",
    date: "Oct 05, 2026"
  }
];

export default function BlogPreviewSection() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--color-neutral-text)] sm:text-4xl">
              Career Insights
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Latest advice and tips from the ApplyIQ team.
            </p>
          </div>
          <Link href="/blog">
            <Button variant="outline">View All Posts</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post, idx) => (
            <Card key={idx} className="h-full flex flex-col group cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">{post.category}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>
                <CardTitle className="text-xl group-hover:text-[var(--color-primary)] transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-600">{post.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
