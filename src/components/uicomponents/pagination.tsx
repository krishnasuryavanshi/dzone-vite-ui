import { PaginationProps } from 'antd/lib/pagination';
import React, { FC } from 'react';
import { Pagination as AntdPagination } from 'antd';

export const Pagination: FC<PaginationProps> = (props) => {
  return <AntdPagination {...props}></AntdPagination>;
};
