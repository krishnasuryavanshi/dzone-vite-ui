import { ListProps } from 'antd/lib/list';
import { List as AntdList } from 'antd';
import React from 'react';

export const List = <T,>({ children, ...rest }: ListProps<T>) => {
  return <AntdList {...rest}>{children}</AntdList>;
};
