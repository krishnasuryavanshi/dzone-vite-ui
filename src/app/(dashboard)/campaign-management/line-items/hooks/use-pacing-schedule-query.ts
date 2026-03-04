import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchPacingSchedule, FetchPacingScheduleParams } from '../services';

export function usePacingScheduleQuery(params: FetchPacingScheduleParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.pacing.schedule(params),
    queryFn: () => fetchPacingSchedule(params),
    enabled,
  });
}
