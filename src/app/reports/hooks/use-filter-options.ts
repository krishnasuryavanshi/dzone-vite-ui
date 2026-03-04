import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/query-keys';
import { FilterConfig } from '../lib/types';
import { fetchFilterOptions } from '../services/fetch-filter-options';
import { useReportFilterStore } from '../store/use-report-filter-store';

export function useFilterOptions(filterConfig: FilterConfig) {
  const stagedFilters = useReportFilterStore((s) => s.stagedFilters);

  // Build dep values from staged filters for cascading
  const depValues: Record<string, unknown> = {};
  if (filterConfig.dependsOn) {
    for (const depId of filterConfig.dependsOn) {
      depValues[depId] = stagedFilters[depId];
    }
  }

  const hasOptions =
    filterConfig.type === 'single-select' || filterConfig.type === 'multi-select';

  return useQuery({
    queryKey: queryKeys.reports.filterOptions(filterConfig.id, depValues),
    queryFn: () => fetchFilterOptions(filterConfig.id, depValues),
    enabled: hasOptions,
  });
}
