'use client';

import { Alert as AntAlert, AlertProps } from 'antd';
import React, { FC } from 'react';

interface IAlertProps extends AlertProps {
  children?: React.ReactNode;
}

export const Alert: FC<IAlertProps> = ({ children, ...rest }) => {
  return <AntAlert {...rest}>{children}</AntAlert>;
};
