'use client';

import { ColorModeContext } from '@/contexts';
import React, { FC, PropsWithChildren, useContext, useEffect } from 'react';

interface IDzThemeprops extends PropsWithChildren {
  theme: string;
}

export const DzTheme: FC<IDzThemeprops> = ({ children, theme }) => {
  const { setCurrentTheme } = useContext(ColorModeContext);
  useEffect(() => {
    setCurrentTheme(theme);
  }, []);

  return <>{children}</>;
};
