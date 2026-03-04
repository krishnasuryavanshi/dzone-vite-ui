import { ResultProps } from 'antd/lib/result';
import { Result as AntdResult } from 'antd';
import React, { FC } from 'react';

export const Result: FC<ResultProps> = ({ children, ...rest }) => {
  return <AntdResult {...rest}>{children}</AntdResult>;
};
