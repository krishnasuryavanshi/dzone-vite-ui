import { create } from 'zustand';
import { IExecutiveFilterDataPayload, IFilterDataPayload } from '../lib/utils';

interface DashboardReportStore {
  filters: IFilterDataPayload | IExecutiveFilterDataPayload;
  progress: Record<string, 'loading' | 'loaded'>;
  updateFilters: (data: IFilterDataPayload | IExecutiveFilterDataPayload) => void;
  updateProgress: (data: Record<string, 'loading' | 'loaded'>) => void;
  resetProgress: () => void;
}

export const useDashboardReportStore = create<DashboardReportStore>((set) => ({
  filters: {} as IFilterDataPayload | IExecutiveFilterDataPayload,
  progress: {},
  updateFilters: (data) => set({ filters: data }),
  updateProgress: (data) =>
    set((s) => ({ progress: { ...s.progress, ...data } })),
  resetProgress: () => set({ progress: {} }),
}));
