import { ListItemProps } from 'antd/lib/list';
import { List } from 'antd';
import React, { FC } from 'react';

const AntdListItem = List.Item;

export const ListItem: FC<ListItemProps> = ({ children, ...rest }) => {
  return <AntdListItem {...rest}>{children}</AntdListItem>;
};
