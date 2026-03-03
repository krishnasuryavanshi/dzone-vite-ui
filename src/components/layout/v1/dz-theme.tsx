import { useThemeStore } from '@/stores/theme-store';
import React, { FC, PropsWithChildren, useEffect } from 'react';

interface IDzThemeprops extends PropsWithChildren {
  theme: string;
}

export const DzTheme: FC<IDzThemeprops> = ({ children, theme }) => {
  const setCurrentTheme = useThemeStore((s) => s.setCurrentTheme);
  useEffect(() => {
    setCurrentTheme(theme);
  }, []);

  return <>{children}</>;
};
