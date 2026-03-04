import { CardProps } from 'antd/lib/card';
import { Card as AntdCard } from 'antd';
import React, { FC } from 'react';

export const Card: FC<CardProps> = ({ children, ...rest }) => {
  return <AntdCard {...rest}>{children}</AntdCard>;
};
