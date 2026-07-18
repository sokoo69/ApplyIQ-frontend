import { useQuery } from '@tanstack/react-query';
import { mockJobs, Job } from '@/lib/mockJobs';

export function useJob(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const job = mockJobs.find((j) => j.id === id);
      
      if (!job) {
        return null;
      }

      // Find 3-4 related jobs in the same category, excluding the current job
      const relatedJobs = mockJobs
        .filter((j) => j.category === job.category && j.id !== id)
        .slice(0, 4);

      return {
        job,
        relatedJobs
      };
    },
    staleTime: 1000 * 60 * 5, // 5 mins
    enabled: !!id, // Only run if ID is truthy
  });
}
