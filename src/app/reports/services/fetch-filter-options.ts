import { FilterOption } from '../lib/types';
import { getMockFilterOptions } from '../mocks/filter-options';

export async function fetchFilterOptions(
  filterId: string,
  depValues: Record<string, unknown>,
): Promise<FilterOption[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 200));
  return getMockFilterOptions(filterId, depValues);
}
