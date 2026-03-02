/**
 * Sider component — stub. The Vite app uses its own sidebar from page-layout.
 */
import React, { FC } from 'react';

interface SiderRenderProps {
  items: React.ReactNode;
  [key: string]: any;
}

interface ISiderProps {
  fixed?: boolean;
  text?: string;
  icon?: React.ReactNode;
  collapsed?: boolean;
}

export const Sider: FC<ISiderProps> = () => {
  return null;
};
