import { create } from 'zustand';

interface CampaignListStore {
  isLoading: boolean;
  showLoader: (loading: boolean) => void;
}

export const useCampaignListStore = create<CampaignListStore>((set) => ({
  isLoading: false,
  showLoader: (loading) => set({ isLoading: loading }),
}));
