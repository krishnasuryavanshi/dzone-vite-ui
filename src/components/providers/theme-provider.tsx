import { App as AntdApp, ConfigProvider, theme } from 'antd';
import React, { FC, PropsWithChildren } from 'react';
import { useThemeStore } from '@/stores/theme-store';

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const mode = useThemeStore((s) => s.mode);
  const uiTheme = useThemeStore((s) => s.uiTheme);

  const { darkAlgorithm, defaultAlgorithm } = theme;

  return (
    <ConfigProvider
      theme={{
        ...uiTheme,
        algorithm: mode === 'light' ? defaultAlgorithm : darkAlgorithm,
      }}
    >
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
};
