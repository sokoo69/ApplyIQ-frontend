import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-neutral-bg)] p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight font-[family-name:var(--font-heading)]">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-800">
          Page not found
        </h2>
        
        <p className="text-gray-500">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        
        <div className="pt-4 flex justify-center">
          <Link href="/">
            <Button variant="primary" className="gap-2 rounded-full px-6">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
