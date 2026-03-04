import { create } from 'zustand';
import { FilterConfig } from '../lib/types';

interface ReportFilterState {
  stagedFilters: Record<string, unknown>;
  committedFilters: Record<string, unknown>;
  activeFilterIds: string[];
  setStagedFilter: (filterId: string, value: unknown, dependentIds?: string[]) => void;
  commitFilters: () => void;
  clearAll: () => void;
  initializeActiveFilters: (filters: FilterConfig[]) => void;
  addFilter: (id: string) => void;
  removeFilter: (id: string, dependentIds: string[]) => void;
}

export const useReportFilterStore = create<ReportFilterState>((set, get) => ({
  stagedFilters: {},
  committedFilters: {},
  activeFilterIds: [],

  setStagedFilter: (filterId, value, dependentIds) =>
    set((state) => {
      const next = { ...state.stagedFilters, [filterId]: value };
      // Clear all dependent (child) filters when parent changes
      if (dependentIds) {
        for (const depId of dependentIds) {
          delete next[depId];
        }
      }
      return { stagedFilters: next };
    }),

  commitFilters: () =>
    set((state) => ({ committedFilters: { ...state.stagedFilters } })),

  clearAll: () =>
    set({ stagedFilters: {}, committedFilters: {} }),

  initializeActiveFilters: (filters) => {
    // Guard against re-initialization
    if (get().activeFilterIds.length > 0) return;
    const ids = filters
      .filter((f) => f.mandatory || f.defaultVisible)
      .map((f) => f.id);
    set({ activeFilterIds: ids });
  },

  addFilter: (id) =>
    set((state) => ({
      activeFilterIds: state.activeFilterIds.includes(id)
        ? state.activeFilterIds
        : [...state.activeFilterIds, id],
    })),

  removeFilter: (id, dependentIds) =>
    set((state) => {
      const toRemove = new Set([id, ...dependentIds]);
      const next = { ...state.stagedFilters };
      for (const rid of toRemove) {
        delete next[rid];
      }
      return {
        activeFilterIds: state.activeFilterIds.filter((fid) => !toRemove.has(fid)),
        stagedFilters: next,
      };
    }),
}));
