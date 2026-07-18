import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationsApi } from '@/lib/api/applications';
import { Application } from '@/types/application';

export function useMyApplications(options?: { enabled?: boolean }) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Application[]>({
    queryKey: ['myApplications'],
    queryFn: applicationsApi.getMyApplications,
    enabled: options?.enabled !== false,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      applicationsApi.updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
  });

  const deleteApplicationMutation = useMutation({
    mutationFn: (id: string) => applicationsApi.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
  });

  return {
    applications: data || [],
    isLoading,
    isError,
    error,
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
    deleteApplication: deleteApplicationMutation.mutateAsync,
    isDeleting: deleteApplicationMutation.isPending,
  };
}
