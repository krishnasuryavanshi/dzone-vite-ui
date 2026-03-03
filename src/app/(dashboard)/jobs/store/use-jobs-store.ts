import { create } from 'zustand';

interface JobsStore {
  // Reset store
  reset: () => void;
}

export const useJobsStore = create<JobsStore>(() => ({
  reset: () => {},
}));
