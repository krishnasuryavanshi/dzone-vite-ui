import { create } from 'zustand';
import { IPacingSummary, IPacingSummaryRow } from '../lib/types';
import { fetchPacingSummary, fetchPacingSummaryData } from '../services';

interface PacingSummaryPagination {
  current: number;
  pageSize: number;
  total: number;
}

interface PacingSummaryStore {
  summary: IPacingSummary | null;
  gridData: IPacingSummaryRow[];
  isLoading: boolean;
  sortOrder: 'ASC' | 'DESC' | null;
  statusFilter: string[];
  showDelivered: boolean;
  pagination: PacingSummaryPagination;

  fetchSummary: (lineItemId: string) => Promise<void>;
  fetchData: (lineItemId: string) => Promise<void>;
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

export const usePacingSummaryStore = create<PacingSummaryStore>((set, get) => ({
  summary: null,
  gridData: [],
  isLoading: false,
  sortOrder: null,
  statusFilter: [],
  showDelivered: false,
  pagination: initialPagination,

  fetchSummary: async (lineItemId: string) => {
    const response = await fetchPacingSummary(lineItemId);
    if (response?.data) {
      const summaryData: IPacingSummary = response.data;
      set({
        summary: summaryData,
        showDelivered: summaryData.delivered !== null,
      });
    }
  },

  fetchData: async (lineItemId: string) => {
    const { pagination } = get();
    set({ isLoading: true });
    try {
      const params: Record<string, any> = {
        page: pagination.current - 1,
        size: pagination.pageSize,
      };
      const { data, total } = await fetchPacingSummaryData(lineItemId, params);
      if (data?.length > 0) {
        set({
          gridData: data ?? [],
          pagination: {
            ...pagination,
            total: total ?? 0,
          },
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  setSortOrder: (sortOrder) => set({ sortOrder }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setPagination: (partial) =>
    set((state) => ({
      pagination: { ...state.pagination, ...partial },
    })),
  reset: () =>
    set({
      summary: null,
      gridData: [],
      isLoading: false,
      sortOrder: null,
      statusFilter: [],
      showDelivered: false,
      pagination: initialPagination,
    }),
}));
