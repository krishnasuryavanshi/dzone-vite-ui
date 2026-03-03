import { create } from 'zustand';
import { ILineItem } from '../lib/types';

interface LineItemContextStore {
  value: Record<string, string>;
  lineItem: ILineItem;
  isLoading: boolean;
  setValue: (
    updater:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>),
  ) => void;
  setLineItem: (lineItem: ILineItem) => void;
  showLoader: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  value: {} as Record<string, string>,
  lineItem: {} as ILineItem,
  isLoading: false,
};

export const useLineItemContextStore = create<LineItemContextStore>(
  (set) => ({
    ...initialState,
    setValue: (updater) =>
      set((s) => ({
        value: typeof updater === 'function' ? updater(s.value) : updater,
      })),
    setLineItem: (lineItem) => set({ lineItem }),
    showLoader: (loading) => set({ isLoading: loading }),
    reset: () => set(initialState),
  }),
);
