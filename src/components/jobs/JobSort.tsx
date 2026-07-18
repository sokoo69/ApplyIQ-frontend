"use client";

import { ArrowUpDown } from 'lucide-react';

interface JobSortProps {
  sortBy: string;
  setSortBy: (val: string) => void;
}

export default function JobSort({ sortBy, setSortBy }: JobSortProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 font-medium">Sort by:</span>
      <div className="relative">
        <select
          className="appearance-none bg-transparent pl-2 pr-8 py-1.5 text-sm font-medium text-gray-900 border-none focus:ring-0 cursor-pointer outline-none"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="salary">Salary (High - Low)</option>
          <option value="deadline">Deadline (Soonest)</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none text-gray-500">
          <ArrowUpDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
