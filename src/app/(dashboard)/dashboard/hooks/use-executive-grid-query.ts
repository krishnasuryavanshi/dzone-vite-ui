import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchExecutiveGrid } from '../services';
import { Filters } from '@/lib/utils/table';
import { IExcecutiveGrids } from '../components/reporting-tabs/executive/types';

export function useExecutiveGridQuery(
  page: number,
  size: number,
  status?: Filters<IExcecutiveGrids> | null,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.dashboard.executiveGrid({ page, size, status }),
    queryFn: async () => {
      const result = await fetchExecutiveGrid(page, size, status);
      if (!result) throw new Error('Failed to fetch executive grid');
      return result;
    },
    placeholderData: keepPreviousData,
    enabled,
  });
}
