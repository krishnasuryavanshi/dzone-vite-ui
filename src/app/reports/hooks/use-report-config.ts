import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/query-keys';
import { fetchReportConfig } from '../services/fetch-report-config';

export function useReportConfig(reportId: string) {
  return useQuery({
    queryKey: queryKeys.reports.config(reportId),
    queryFn: () => fetchReportConfig(reportId),
    enabled: !!reportId,
  });
}
