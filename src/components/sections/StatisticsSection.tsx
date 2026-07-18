"use client";

import { useEffect, useState, useRef } from 'react';

function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, duration, isVisible]);

  return (
    <div ref={countRef} className="text-4xl font-extrabold text-[var(--color-primary)] md:text-5xl">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function StatisticsSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 border-y border-gray-100">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 text-center">
          <div className="space-y-2">
            <AnimatedCounter end={10000} suffix="+" />
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Jobs Tracked</p>
          </div>
          <div className="space-y-2">
            <AnimatedCounter end={3} suffix="x" />
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Higher Response Rate</p>
          </div>
          <div className="space-y-2">
            <AnimatedCounter end={95} suffix="%" />
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Interview Success</p>
          </div>
        </div>
      </div>
    </section>
  );
}
