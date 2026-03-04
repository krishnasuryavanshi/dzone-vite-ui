import { DropdownProps } from 'antd/lib/dropdown';
import { Dropdown as AntdDropdown } from 'antd';
import React, { FC } from 'react';

export const Dropdown: FC<DropdownProps> = ({ children, ...rest }) => {
  return <AntdDropdown {...rest}>{children}</AntdDropdown>;
};
