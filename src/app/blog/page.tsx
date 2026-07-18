import Link from 'next/link';
import { mockBlogPosts } from '@/lib/mockBlogPosts';
import { Card, CardContent } from '@/components/ui/Card';
import { format } from 'date-fns';

export const metadata = {
  title: 'Career Advice Blog | ApplyIQ',
  description: 'Expert advice, tips, and strategies for accelerating your career and mastering the job search.',
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-[var(--color-neutral-bg)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight font-[family-name:var(--font-heading)] mb-4">
            Career Insights & Advice
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Actionable strategies to help you land your dream job, ace your interviews, and negotiate the salary you deserve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockBlogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group h-full flex">
              <Card className="h-full w-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="flex flex-col flex-grow p-6">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed mb-4 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="text-[var(--color-primary)] text-sm font-semibold mt-auto flex items-center">
                    Read Article <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
