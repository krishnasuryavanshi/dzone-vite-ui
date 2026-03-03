import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchSupplierDashboardData } from '../services/fetch-supplier-dashboard-data';
import { supplierDataParams } from '../types/supplier-dashboard';

export function useSupplierDashboardQuery(
  params: supplierDataParams,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.analytics.supplierDashboard(params),
    queryFn: () => fetchSupplierDashboardData(params),
    enabled,
  });
}
