"use client";

import { Search, MapPin, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface JobFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
}

const CATEGORIES = [
  "All Categories",
  "Software Engineering",
  "Design",
  "Data",
  "Mobile",
  "DevOps",
  "Marketing",
  "Content",
  "QA",
  "AI/ML",
  "Support"
];

const LOCATIONS = [
  "All Locations",
  "Remote",
  "Dhaka, Bangladesh"
];

export default function JobFilters({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  location,
  setLocation
}: JobFiltersProps) {
  return (
    <Card className="p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="col-span-1 md:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-sm"
            placeholder="Search by job title or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="col-span-1 md:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Tag className="h-4 w-4 text-gray-400" />
          </div>
          <select
            className="w-full pl-9 pr-8 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-sm appearance-none bg-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c === "All Categories" ? "" : c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="col-span-1 md:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-4 w-4 text-gray-400" />
          </div>
          <select
            className="w-full pl-9 pr-8 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-sm appearance-none bg-white"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {LOCATIONS.map((l) => (
              <option key={l} value={l === "All Locations" ? "" : l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
}
