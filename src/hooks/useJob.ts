import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '../lib/api/jobs';

export function useJob(id: string) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.getJobById(id),
    enabled: !!id,
  });

  // Note: we can map the backend job to return { job: data }
  // If the old mock returned { job, relatedJobs }, we'll just mock relatedJobs or omit it.
  return { 
    job: data, 
    relatedJobs: [], // omitted for brevity per rules since backend doesn't return it
    isLoading, 
    isError, 
    error, 
    refetch 
  };
}
