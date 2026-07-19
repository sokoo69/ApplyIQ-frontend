"use client";

import { useState } from 'react';
import { useJobs } from '@/hooks/useJobs';
import JobFilters from '@/components/jobs/JobFilters';
import JobSort from '@/components/jobs/JobSort';
import JobCard from '@/components/jobs/JobCard';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Briefcase, XCircle } from 'lucide-react';

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const { user, isAuthenticated } = useAuth();

  const limit = 8; // 8 cards per page (4 per row on desktop = 2 rows)

  // Reset to page 1 whenever filters change
  const handleSearchChange = (val: string) => { setSearchQuery(val); setPage(1); };
  const handleCategoryChange = (val: string) => { setCategory(val); setPage(1); };
  const handleLocationChange = (val: string) => { setLocation(val); setPage(1); };
  const handleSortChange = (val: string) => { setSortBy(val); setPage(1); };

  const { jobs, pagination, isLoading, isError } = useJobs({
    search: searchQuery, // changed to match backend API query param 'search' instead of 'searchQuery'
    category,
    location,
    sort: sortBy,
    page,
    limit
  });

  const clearFilters = () => {
    setSearchQuery('');
    setCategory('');
    setLocation('');
    setSortBy('newest');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[var(--color-neutral-bg)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-[family-name:var(--font-heading)]">Explore Jobs</h1>
            <p className="mt-2 text-gray-600">Find your next role from our curated list of opportunities.</p>
          </div>
          <div className="w-full md:w-auto">
            <JobSort sortBy={sortBy} setSortBy={handleSortChange} />
          </div>
        </div>

        <JobFilters 
          searchQuery={searchQuery} setSearchQuery={handleSearchChange}
          category={category} setCategory={handleCategoryChange}
          location={location} setLocation={handleLocationChange}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="flex flex-col h-[280px]">
                <Skeleton className="w-full h-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-red-500">Something went wrong while fetching jobs.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {/* Success State */}
        {!isLoading && !isError && (
          <>
            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-gray-200">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-500 mb-6 max-w-md text-center">
                  We couldn't find any jobs matching your current filters. Try adjusting your search criteria.
                </p>
                <Button onClick={clearFilters} variant="outline" className="gap-2">
                  <XCircle className="h-4 w-4" /> Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {jobs.map((job: any, index: number) => (
                  <JobCard key={job._id || job.id} job={job} userRole={isAuthenticated ? user?.role : null} isPriority={index < 4} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 px-4">
                  Page {page} of {pagination.pages}
                </span>
                <Button 
                  variant="outline"
                  size="sm"
                  disabled={page === pagination.pages}
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
