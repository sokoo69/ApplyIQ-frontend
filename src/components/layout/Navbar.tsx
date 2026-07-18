"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAiDropdownOpen, setIsAiDropdownOpen] = useState(false);
  
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] font-bold text-white">
                AIQ
              </div>
              <span className="text-xl font-bold tracking-tight font-[family-name:var(--font-heading)]">ApplyIQ</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-6">
            {!isAuthenticated ? (
              <>
                <Link href="/jobs" className="text-sm font-medium text-gray-700 hover:text-[var(--color-primary)]">Explore Jobs</Link>
                <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-[var(--color-primary)]">About Us</Link>
                <div className="flex items-center gap-4 ml-4">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Log in</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="sm">Sign up</Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-[var(--color-primary)]">Dashboard</Link>
                <Link href="/jobs" className="text-sm font-medium text-gray-700 hover:text-[var(--color-primary)]">Jobs</Link>
                <Link href="/items/manage" className="text-sm font-medium text-gray-700 hover:text-[var(--color-primary)]">My Applications</Link>
                
                <div className="relative">
                  <button 
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[var(--color-primary)]"
                    onClick={() => setIsAiDropdownOpen(!isAiDropdownOpen)}
                  >
                    AI Tools <ChevronDown className="h-4 w-4" />
                  </button>
                  {isAiDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                      <Link href="/ai/match" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsAiDropdownOpen(false)}>Resume Match</Link>
                      <Link href="/ai/cover-letter" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsAiDropdownOpen(false)}>Cover Letter Gen</Link>
                      <Link href="/ai/interview-coach" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsAiDropdownOpen(false)}>Interview Coach</Link>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                  <Button variant="ghost" size="sm" onClick={() => logout()} disabled={isLoggingOut}>
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </Button>
                </div>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {!isAuthenticated ? (
              <>
                <Link href="/jobs" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)]">Explore Jobs</Link>
                <Link href="/about" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)]">About Us</Link>
                <Link href="/login" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)]">Log in</Link>
                <Link href="/register" className="block rounded-md px-3 py-2 text-base font-medium text-[var(--color-primary)] hover:bg-gray-50">Sign up</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)]">Dashboard</Link>
                <Link href="/jobs" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)]">Jobs</Link>
                <Link href="/items/manage" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)]">My Applications</Link>
                <div className="px-3 py-2">
                  <div className="text-base font-medium text-gray-900 mb-1">AI Tools</div>
                  <div className="pl-4 space-y-1">
                    <Link href="/ai/match" className="block rounded-md py-2 text-sm font-medium text-gray-600 hover:text-[var(--color-primary)]">Resume Match</Link>
                    <Link href="/ai/cover-letter" className="block rounded-md py-2 text-sm font-medium text-gray-600 hover:text-[var(--color-primary)]">Cover Letter Gen</Link>
                    <Link href="/ai/interview-coach" className="block rounded-md py-2 text-sm font-medium text-gray-600 hover:text-[var(--color-primary)]">Interview Coach</Link>
                  </div>
                </div>
                <button 
                  className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50"
                  onClick={() => logout()}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
