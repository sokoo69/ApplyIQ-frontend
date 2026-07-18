import { notFound } from 'next/navigation';
import { mockBlogPosts } from '@/lib/mockBlogPosts';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function generateStaticParams() {
  return mockBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = mockBlogPosts.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Post Not Found' };
  
  return {
    title: `${post.title} | ApplyIQ Blog`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = mockBlogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="relative h-[400px] sm:h-[500px] w-full bg-gray-900">
        <img
          src={post.coverImageUrl}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
          <Link href="/blog" className="inline-flex items-center text-gray-300 hover:text-white mb-6 text-sm font-medium transition-colors w-max">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
          </Link>
          <div className="text-indigo-300 font-semibold uppercase tracking-wider text-sm mb-3">
            {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-[family-name:var(--font-heading)] leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg prose-indigo w-full max-w-none font-serif text-gray-700 leading-relaxed">
          <p className="text-xl text-gray-500 font-sans font-medium mb-8">
            {post.excerpt}
          </p>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          {/* Note: since this is just mock content, it's a short string, but in reality we'd render markdown or rich text here. */}
        </div>
      </div>
    </div>
  );
}
