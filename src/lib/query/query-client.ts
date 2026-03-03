import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { logger } from '@/services/logger';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Only notify on background refetch failures (data was previously loaded).
      // First-load errors are already surfaced by authenticatedRequest's
      // showNotification, so we avoid duplicate toasts here.
      if (query.state.data !== undefined) {
        logger.warn('Background refetch failed', {
          queryKey: query.queryKey,
          error: String(error),
        });
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      logger.error('Mutation failed', { error: String(error) });
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 min — prevents redundant fetches during navigation
      gcTime: 10 * 60 * 1000, // 10 min — cache persists after unmount
      refetchOnWindowFocus: false, // admin tool; surprise refetches during form editing are disruptive
      refetchOnReconnect: true,
      retry: (failureCount, error: any) => {
        // Don't retry auth/validation errors
        const status = error?.status ?? error?.response?.status;
        if ([400, 401, 403, 422].includes(status)) return false;
        // Retry server errors up to 2 times
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
