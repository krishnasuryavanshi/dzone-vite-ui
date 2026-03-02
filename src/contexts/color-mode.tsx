'use client';

import { App as AntdApp, ConfigProvider, theme } from 'antd';
import Cookies from 'js-cookie';
import React, {
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react';
import { blueThemeV1, blueThemeV2 } from '../config';
import { blackTheme } from '@/config/black.theme';

type ColorModeContextType = {
  mode: string;
  setMode: (mode: string) => void;
  setCurrentTheme: (uiTheme: string) => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType,
);

type ColorModeContextProviderProps = {
  defaultMode?: string;
};

export const ColorModeContextProvider: FC<
  PropsWithChildren<ColorModeContextProviderProps>
> = ({ children, defaultMode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState(defaultMode || 'light');
  const [uiTheme, setUiTheme] = useState<any>(blueThemeV1);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const theme = Cookies.get('theme') || 'light';
      setMode(theme);
    }
  }, [isMounted]);

  const setColorMode = () => {
    if (mode === 'light') {
      setMode('dark');
      Cookies.set('theme', 'dark');
    } else {
      setMode('light');
      Cookies.set('theme', 'light');
    }
  };

  const setCurrentTheme = (uiTheme: string) => {
    setUiTheme(uiTheme === 'blueV1' ? blueThemeV1 : blackTheme);
  };

  const { darkAlgorithm, defaultAlgorithm } = theme;

  return (
    <ColorModeContext.Provider
      value={{
        mode,
        setMode: setColorMode,
        setCurrentTheme,
      }}>
      <ConfigProvider
        // you can change the theme colors here. example: ...RefineThemes.Magenta,
        theme={{
          ...uiTheme,
          algorithm: mode === 'light' ? defaultAlgorithm : darkAlgorithm,
        }}>
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </ColorModeContext.Provider>
  );
};
