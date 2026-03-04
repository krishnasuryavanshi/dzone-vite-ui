import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchMarketerDashboardData } from '../../supplier/services/fetch-marketer-dashboard-data';
import { MarketerDataParams } from '../../supplier/types/supplier-dashboard';

export function useMarketerDashboardQuery(params: MarketerDataParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.analytics.marketerDashboard(params),
    queryFn: () => fetchMarketerDashboardData(params),
    enabled,
  });
}
