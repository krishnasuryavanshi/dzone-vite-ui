import { MenuItemProps } from 'antd/lib/menu';
import { Menu as AntdMenu } from 'antd';
import React, { FC } from 'react';

const { Item: AntdMenuItem } = AntdMenu;

export const MenuItem: FC<MenuItemProps> = ({ children, ...rest }) => {
  return <AntdMenuItem {...rest}>{children}</AntdMenuItem>;
};
