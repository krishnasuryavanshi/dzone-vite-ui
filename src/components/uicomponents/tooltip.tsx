import { Tooltip as AntTooltip, TooltipProps } from 'antd';
import React, { FC } from 'react';

export const Tooltip: FC<TooltipProps> = ({ children, ...rest }) => {
  return <AntTooltip {...rest}>{children}</AntTooltip>;
};
