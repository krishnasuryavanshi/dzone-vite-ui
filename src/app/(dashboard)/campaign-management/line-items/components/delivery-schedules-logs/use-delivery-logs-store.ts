import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface DeliveryLogsFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
}

interface DeliveryLogsStore {
  filters: DeliveryLogsFilters;
  pagination: {
    currentPage: number;
    perPage: number;
  };

  setFilters: (filters: Partial<DeliveryLogsFilters>) => void;
  setPagination: (pagination: Partial<DeliveryLogsStore['pagination']>) => void;
  resetFilters: () => void;
}

export const useDeliveryLogsStore = create<DeliveryLogsStore>()(
  immer((set) => ({
    filters: {},
    pagination: {
      currentPage: 1,
      perPage: 25,
    },

    setFilters: (filters) =>
      set((state) => {
        state.filters = { ...state.filters, ...filters };
        state.pagination.currentPage = 1;
      }),

    setPagination: (pagination) =>
      set((state) => {
        state.pagination = { ...state.pagination, ...pagination };
      }),

    resetFilters: () =>
      set((state) => ({
        filters: {},
        pagination: {
          currentPage: 1,
          perPage: state.pagination.perPage,
        },
      })),
  })),
);
