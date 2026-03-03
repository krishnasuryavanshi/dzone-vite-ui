import { create } from 'zustand';
import { ILead } from '../../leads/lib/types';

interface LeadsData {
  currentPage: number;
  pageSize: number;
  selectedLeadsStatus: string[];
  selectedValidationStatus: string[];
  sortBy?: string | null;
  sortOrder?: 'asc' | 'desc' | null;
}

interface LeadsStore {
  // Leads list (synced from TanStack Query by parent component)
  leadsList: ILead[];
  setLeadsList: (leads: ILead[]) => void;

  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;

  // Leads data state
  leadsData: LeadsData;
  updateLeadsData: (data: Partial<LeadsData>) => void;
  resetLeadsData: () => void;

  // Export state
  isExporting: boolean;
  setIsExporting: (value: boolean) => void;
}

const initialLeadsData: LeadsData = {
  currentPage: 1,
  pageSize: 25,
  selectedLeadsStatus: [],
  selectedValidationStatus: [],
  sortBy: null,
  sortOrder: null,
};

export const useLeadsStore = create<LeadsStore>((set) => ({
  leadsList: [],
  setLeadsList: (leads) => set({ leadsList: leads }),

  selectedIds: [],
  setSelectedIds: (ids) => set({ selectedIds: ids }),

  // Leads data state
  leadsData: initialLeadsData,
  updateLeadsData: (data) =>
    set((state) => ({
      leadsData: { ...state.leadsData, ...data },
    })),
  resetLeadsData: () =>
    set({
      leadsData: initialLeadsData,
      leadsList: [],
      selectedIds: [],
    }),

  // Export state
  isExporting: false,
  setIsExporting: (value) => set({ isExporting: value }),
}));
