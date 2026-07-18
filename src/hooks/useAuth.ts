import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch current user using httpOnly cookie
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['authUser'],
    queryFn: authApi.getCurrentUser,
    retry: false, // Don't retry on 401
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  const user = data?.user || null;

  // Mutations
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      router.push('/dashboard');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      router.push('/dashboard');
    },
  });

  const demoLoginMutation = useMutation({
    mutationFn: authApi.demoLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      router.push('/dashboard');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['authUser'], null);
      router.push('/');
    },
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    isError,
    error,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    
    demoLogin: demoLoginMutation.mutateAsync,
    isDemoLoggingIn: demoLoginMutation.isPending,
    demoLoginError: demoLoginMutation.error,
    
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
