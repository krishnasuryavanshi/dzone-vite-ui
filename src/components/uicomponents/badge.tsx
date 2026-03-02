import React, { FC } from 'react';
import { Badge as AntdBadge } from 'antd';
import { BadgeProps } from 'antd/lib';

interface IBadgeProps extends BadgeProps {}

export const Badge: FC<IBadgeProps> = ({ children, ...restProps }) => {
  return <AntdBadge {...restProps}>{children}</AntdBadge>;
};
