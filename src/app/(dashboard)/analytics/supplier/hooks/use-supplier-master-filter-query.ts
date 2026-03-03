import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchSupplierMasterFilterList } from '../services/fetch-supplier-master-filter';

export function useSupplierMasterFilterQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.analytics.supplierFilters(),
    queryFn: async () => {
      const result = await fetchSupplierMasterFilterList();
      if (!result) throw new Error('Failed to fetch supplier master filters');
      return result;
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
