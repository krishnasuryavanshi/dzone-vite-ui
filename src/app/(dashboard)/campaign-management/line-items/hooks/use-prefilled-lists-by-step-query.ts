import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchPrefilledListsByStep } from '../services';
import { LineItemSteps } from '../lib/enums';

export function usePrefilledListsByStepQuery(step: LineItemSteps, userId?: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.lineItems.all, 'prefilledListsByStep', step, userId],
    queryFn: () => fetchPrefilledListsByStep(step, userId),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled,
  });
}
