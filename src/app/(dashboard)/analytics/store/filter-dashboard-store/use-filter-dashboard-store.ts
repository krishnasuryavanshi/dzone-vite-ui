import { create } from 'zustand';

export type FilterValues = {
  dateRange: { startDate: string; endDate: string };
  selectedCompaigns?: string[];
  selectedSuppliers?: string[];
  reset?: boolean;
  selectedComparison?: string;
  selectedLineItems?: string[];
  selectedMarketers?: string[];
};

export interface FilterState {
  marketerData: any;
  returnReasonData: any;
  supplierPieData: any;
  supplierBarData: any;
  filterValues: FilterValues;
  topReason: any;
  compareFactor: string;

  setMarketerData: (data: any) => void;
  setReturnReasonData: (data: any) => void;
  setSupplierPieData: (data: any) => void;
  setSupplierBarData: (data: any) => void;
  setFilterValues: (data: FilterValues) => void;
  setTopReason: (data: any) => void;
  setCompareFactor: (data: string) => void;
}

export const useFilterDashboardStore = create<FilterState>((set) => ({
  marketerData: null,
  returnReasonData: null,
  supplierPieData: null,
  supplierBarData: null,
  filterValues: {
    dateRange: { startDate: '', endDate: '' },
    selectedCompaigns: [],
    selectedSuppliers: [],
    selectedLineItems: [],
    selectedMarketers: [],
    reset: false,
  },
  topReason: 5,
  compareFactor: 'week',

  setMarketerData: (marketerData) => set({ marketerData }),
  setReturnReasonData: (returnReasonData) => set({ returnReasonData }),
  setSupplierPieData: (supplierPieData) => set({ supplierPieData }),
  setSupplierBarData: (supplierBarData) => set({ supplierBarData }),
  setFilterValues: (filterValues) => set({ filterValues }),
  setTopReason: (topReason) => set({ topReason }),
  setCompareFactor: (compareFactor) => set({ compareFactor }),
}));
