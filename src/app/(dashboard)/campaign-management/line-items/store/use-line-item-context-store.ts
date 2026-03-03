import { create } from 'zustand';
import { ILineItem, IStatusPicklist } from '../lib/types';
import { fetchStatusPicklist } from '../services';

interface LineItemContextStore {
  value: Record<string, string>;
  lineItem: ILineItem;
  isLoading: boolean;
  updateList: ILineItem | undefined;
  statusList: IStatusPicklist[];
  statusListFetched: boolean;
  setValue: (
    updater:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>),
  ) => void;
  setLineItem: (lineItem: ILineItem) => void;
  showLoader: (loading: boolean) => void;
  setUpdateList: (item: ILineItem | undefined) => void;
  fetchStatusData: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  value: {} as Record<string, string>,
  lineItem: {} as ILineItem,
  isLoading: false,
  updateList: undefined as ILineItem | undefined,
  statusList: [] as IStatusPicklist[],
  statusListFetched: false,
};

export const useLineItemContextStore = create<LineItemContextStore>(
  (set, get) => ({
    ...initialState,
    setValue: (updater) =>
      set((s) => ({
        value: typeof updater === 'function' ? updater(s.value) : updater,
      })),
    setLineItem: (lineItem) => set({ lineItem }),
    showLoader: (loading) => set({ isLoading: loading }),
    setUpdateList: (item) => set({ updateList: item }),
    fetchStatusData: async () => {
      if (get().statusListFetched) return;
      const data = await fetchStatusPicklist();
      set({
        statusList: data as unknown as IStatusPicklist[],
        statusListFetched: true,
      });
    },
    reset: () => set(initialState),
  }),
);
