import { create } from 'zustand';
import { IExecutiveFilterDataPayload, IFilterDataPayload } from '../lib/utils';

interface DashboardReportStore {
  filters: IFilterDataPayload | IExecutiveFilterDataPayload;
  updateFilters: (data: IFilterDataPayload | IExecutiveFilterDataPayload) => void;
  resetFilters: () => void;
}

export const useDashboardReportStore = create<DashboardReportStore>((set) => ({
  filters: {} as IFilterDataPayload | IExecutiveFilterDataPayload,
  updateFilters: (data) => set({ filters: data }),
  resetFilters: () => set({ filters: {} as IFilterDataPayload | IExecutiveFilterDataPayload }),
}));
