import { create } from 'zustand';

interface PacingSummaryPagination {
  current: number;
  pageSize: number;
  total: number;
}

interface PacingSummaryStore {
  sortOrder: 'ASC' | 'DESC' | null;
  statusFilter: string[];
  pagination: PacingSummaryPagination;

  setSortOrder: (sortOrder: 'ASC' | 'DESC' | null) => void;
  setStatusFilter: (statusFilter: string[]) => void;
  setPagination: (pagination: Partial<PacingSummaryPagination>) => void;
  reset: () => void;
}

const initialPagination: PacingSummaryPagination = {
  current: 1,
  pageSize: 100,
  total: 0,
};

export const usePacingSummaryStore = create<PacingSummaryStore>((set) => ({
  sortOrder: null,
  statusFilter: [],
  pagination: initialPagination,

  setSortOrder: (sortOrder) => set({ sortOrder }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setPagination: (partial) =>
    set((state) => ({
      pagination: { ...state.pagination, ...partial },
    })),
  reset: () =>
    set({
      sortOrder: null,
      statusFilter: [],
      pagination: initialPagination,
    }),
}));
