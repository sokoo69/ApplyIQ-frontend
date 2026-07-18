import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] font-bold text-white">
                AIQ
              </div>
              <span className="text-xl font-bold tracking-tight font-[family-name:var(--font-heading)]">ApplyIQ</span>
            </Link>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              Your AI-powered career copilot. We help you track applications, analyze your skills, and ace your interviews.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 font-[family-name:var(--font-heading)]">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs" className="text-gray-500 hover:text-[var(--color-primary)]">Explore Jobs</Link></li>
              <li><Link href="/login" className="text-gray-500 hover:text-[var(--color-primary)]">Sign In</Link></li>
              <li><Link href="/register" className="text-gray-500 hover:text-[var(--color-primary)]">Create Account</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 font-[family-name:var(--font-heading)]">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-500 hover:text-[var(--color-primary)]">About Us</Link></li>
              <li><Link href="/blog" className="text-gray-500 hover:text-[var(--color-primary)]">Blog</Link></li>
              <li><Link href="/privacy" className="text-gray-500 hover:text-[var(--color-primary)]">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 font-[family-name:var(--font-heading)]">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>hello@applyiq.com</li>
              <li>1-800-APPLY-IQ</li>
              <li className="pt-4 flex gap-4">
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[var(--color-primary)]">
                  Twitter
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[var(--color-primary)]">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ApplyIQ. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-gray-900">Terms of Service</Link>
            <Link href="/privacy" className="text-gray-400 hover:text-gray-900">Privacy Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
