'use client';
import { Drawer as AntDrawer, DrawerProps } from 'antd';
import React, { FC } from 'react';
import './drawer.scss';

interface IDrawerProps extends DrawerProps {
  children?: React.ReactNode;
}

export const Drawer: FC<IDrawerProps> = ({ children, ...rest }) => {
  return <AntDrawer {...rest}>{children}</AntDrawer>;
};
