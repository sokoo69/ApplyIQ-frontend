import { useQuery } from '@tanstack/react-query';
import { mockJobs, Job } from '@/lib/mockJobs';

interface UseJobsParams {
  searchQuery: string;
  category: string;
  location: string;
  sortBy: string;
  page: number;
  limit: number;
}

export function useJobs({
  searchQuery,
  category,
  location,
  sortBy,
  page,
  limit
}: UseJobsParams) {
  return useQuery({
    queryKey: ['jobs', { searchQuery, category, location, sortBy, page, limit }],
    queryFn: async () => {
      // 1. Simulate network delay (at least 400ms as requested)
      await new Promise((resolve) => setTimeout(resolve, 600));

      // 2. Filter
      let filtered = mockJobs.filter((job) => {
        // Text search
        if (searchQuery) {
          const lowerQ = searchQuery.toLowerCase();
          if (!job.title.toLowerCase().includes(lowerQ) && !job.company.toLowerCase().includes(lowerQ)) {
            return false;
          }
        }
        // Category
        if (category && job.category !== category) {
          return false;
        }
        // Location
        if (location && job.location !== location) {
          return false;
        }
        return true;
      });

      // 3. Sort
      filtered.sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'salary') {
          return b.salaryRange.max - a.salaryRange.max;
        }
        if (sortBy === 'deadline') {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        return 0;
      });

      // 4. Paginate
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit);
      
      const startIndex = (page - 1) * limit;
      const paginatedData = filtered.slice(startIndex, startIndex + limit);

      return {
        data: paginatedData,
        meta: {
          total,
          page,
          limit,
          totalPages
        }
      };
    },
    staleTime: 1000 * 60 * 5, // 5 mins
  });
}
