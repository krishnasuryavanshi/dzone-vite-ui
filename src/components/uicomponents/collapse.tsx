import { CollapseProps } from 'antd/lib/collapse';
import { Collapse as AntdCollapse } from 'antd';
import React, { FC } from 'react';

export const Collapse: FC<CollapseProps> = ({ children, ...rest }) => {
  return <AntdCollapse {...rest}>{children}</AntdCollapse>;
};
