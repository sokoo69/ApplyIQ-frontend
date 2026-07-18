import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '../lib/api/jobs';

export interface UseJobsParams {
  category?: string;
  location?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export function useJobs(params?: UseJobsParams) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobsApi.getJobs(params),
  });

  return {
    jobs: data?.jobs || [],
    pagination: data?.pagination || { total: 0, page: 1, pages: 1 },
    isLoading,
    isError,
    error,
    refetch,
  };
}
