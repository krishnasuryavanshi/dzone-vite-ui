import { MenuProps } from 'antd/lib/menu';
import { Menu as AntdMenu } from 'antd';
import React, { FC } from 'react';

export const Menu: FC<MenuProps> = ({ children, ...rest }) => {
  return <AntdMenu {...rest}>{children}</AntdMenu>;
};
