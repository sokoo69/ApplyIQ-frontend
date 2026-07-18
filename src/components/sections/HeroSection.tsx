"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, FileCheck, Sparkles, Target } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';

const matchStats = [
  { role: "Frontend Developer", score: 92, icon: <FileCheck className="h-5 w-5 text-[var(--color-secondary)]" /> },
  { role: "UX Designer", score: 85, icon: <Sparkles className="h-5 w-5 text-[var(--color-accent)]" /> },
  { role: "Product Manager", score: 78, icon: <Target className="h-5 w-5 text-[var(--color-primary)]" /> },
];

export default function HeroSection() {
  const [activeStat, setActiveStat] = useState(0);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % matchStats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getMatchScoreLink = () => {
    if (!isAuthenticated) return '/login';
    if (user?.role === 'admin') return '/admin/jobs';
    return '/ai/match';
  };

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-[var(--color-neutral-bg)] px-4 py-20 text-center sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[var(--color-primary)]/5 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-[var(--color-secondary)]/5 blur-[100px]" />
      
      <div className="relative z-10 max-w-4xl space-y-8">
        <Badge variant="accent" className="mx-auto mb-4 animate-fade-in-up">
          ApplyIQ 1.0 is Live
        </Badge>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-neutral-text)] sm:text-5xl md:text-6xl lg:text-7xl">
          Stop Guessing.<br className="hidden sm:block" />
          <span className="text-[var(--color-primary)]">Apply Smarter.</span>
        </h1>
        
        <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
          The AI-powered career copilot that tracks your job applications, analyzes your resume against job descriptions, and coaches you for interviews.
        </p>
        
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/jobs">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              Explore Jobs <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={getMatchScoreLink()}>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Try AI Match Score
            </Button>
          </Link>
        </div>

        {/* Interactive Element: Rotating Match Score Card */}
        <div className="mx-auto mt-12 max-w-sm">
          <Card className="transform transition-all duration-500 hover:scale-105">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                  {matchStats[activeStat].icon}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">Your Resume Match</p>
                  <p className="text-xs text-gray-500">{matchStats[activeStat].role}</p>
                </div>
              </div>
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full border-2 border-[var(--color-secondary)] bg-white shadow-sm transition-all duration-300">
                <span className="text-sm font-bold text-[var(--color-secondary)]">{matchStats[activeStat].score}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
