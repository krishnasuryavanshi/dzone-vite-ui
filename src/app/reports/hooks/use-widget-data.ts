import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/query-keys';
import { WidgetConfig } from '../lib/types';
import { fetchWidgetData } from '../services/fetch-widget-data';
import { useReportFilterStore } from '../store/use-report-filter-store';

export function useWidgetData(widgetConfig: WidgetConfig) {
  const committedFilters = useReportFilterStore((s) => s.committedFilters);

  return useQuery({
    queryKey: queryKeys.reports.widgetData(widgetConfig.id, committedFilters),
    queryFn: () => fetchWidgetData(widgetConfig.id, committedFilters),
  });
}
