import { InputNumberProps } from 'antd/lib/input-number';
import { InputNumber as AntdInputNumber } from 'antd';
import React, { FC } from 'react';

interface IInputNumberProps extends InputNumberProps {}

export const InputNumber: FC<IInputNumberProps> = ({ children, ...rest }) => {
  return <AntdInputNumber {...rest}>{children}</AntdInputNumber>;
};
