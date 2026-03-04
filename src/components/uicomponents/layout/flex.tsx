import { FlexProps } from 'antd/lib';
import { Flex as AntdFlex } from 'antd';
import React, { FC } from 'react';

export const Flex: FC<FlexProps> = ({ children, ...rest }) => {
  return <AntdFlex {...rest}>{children}</AntdFlex>;
};
