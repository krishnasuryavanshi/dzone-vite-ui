import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchJobMonitoringJobs } from '../services';

export function useJobsQuery(
  page: number,
  size: number,
  lineItemId?: string,
  params?: Record<string, unknown>,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.jobs.list({ page, size, lineItemId, ...params }),
    queryFn: async () => {
      const result = await fetchJobMonitoringJobs(page, size, lineItemId, params);
      if (!result) throw new Error('Failed to fetch jobs');
      return result;
    },
    placeholderData: keepPreviousData,
    enabled,
  });
}
