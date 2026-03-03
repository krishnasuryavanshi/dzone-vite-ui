import { create } from 'zustand';
import Cookies from 'js-cookie';
import { blueThemeV1 } from '@/config';
import { blackTheme } from '@/config/black.theme';

interface ThemeStore {
  mode: string;
  uiTheme: any;
  setMode: () => void;
  setCurrentTheme: (uiTheme: string) => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: Cookies.get('theme') || 'light',
  uiTheme: blueThemeV1,
  setMode: () => {
    const next = get().mode === 'light' ? 'dark' : 'light';
    Cookies.set('theme', next);
    set({ mode: next });
  },
  setCurrentTheme: (themeName) => {
    set({ uiTheme: themeName === 'blueV1' ? blueThemeV1 : blackTheme });
  },
}));
