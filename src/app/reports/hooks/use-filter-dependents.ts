import { useMemo } from 'react';
import { FilterConfig } from '../lib/types';

/**
 * Returns all transitive dependent filter IDs for a given filter.
 * e.g. if marketer → campaign → lineItem, then dependents of marketer = [campaign, lineItem]
 */
export function useFilterDependents(filterId: string, allFilters: FilterConfig[]): string[] {
  return useMemo(() => {
    const result: string[] = [];
    const queue = [filterId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const f of allFilters) {
        if (f.dependsOn?.includes(current) && !result.includes(f.id)) {
          result.push(f.id);
          queue.push(f.id);
        }
      }
    }

    return result;
  }, [filterId, allFilters]);
}
