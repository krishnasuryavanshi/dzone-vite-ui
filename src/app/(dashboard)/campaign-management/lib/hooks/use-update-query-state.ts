import { useQueryState } from '@/lib/hooks';

export function useUpdateQueryState() {
  const { queryState, setQueryState } = useQueryState();

  const updateQueryParams = (step: number, replace: boolean = false) => {
    setQueryState([{ name: 'step', value: step.toString() }], replace);
  };
  return {
    queryState,
    updateQueryParams,
  };
}
