import { DzRecord } from '@/lib/types';
import { hasUnsavedChanges } from '@/lib/utils';
import { create } from 'zustand';

interface UnsavedDataStore {
  source: any;
  target: any;
  actions: DzRecord | null;
  actionsData: DzRecord | null;
  setSourceObject: (source: any) => void;
  setTargetObject: (target: any) => void;
  updateTargetObject: (target: any) => void;
  setActionsObject: (actions: DzRecord | null) => void;
  setActionsDataObject: (actionsData: DzRecord | null) => void;
  clear: () => void;
  hasUnsavedData: () => boolean;
}

export const useUnsavedDataStore = create<UnsavedDataStore>((set, get) => ({
  source: null,
  target: null,
  actions: null,
  actionsData: null,
  setSourceObject: (sourceObj) => set({ source: sourceObj, target: sourceObj }),
  setTargetObject: (targetObj) => set({ target: targetObj }),
  updateTargetObject: (targetObj) =>
    set((s) => ({ target: { ...s.target, ...targetObj } })),
  setActionsObject: (actions) => set({ actions }),
  setActionsDataObject: (actionsData) => set({ actionsData }),
  clear: () => set({ source: null, target: null, actions: null, actionsData: null }),
  hasUnsavedData: () => hasUnsavedChanges(get().source, get().target),
}));
