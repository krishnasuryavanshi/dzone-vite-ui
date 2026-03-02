import React, { FC } from 'react';
import { Tag as AntdTag } from 'antd';
import { TagProps } from 'antd/lib';

interface ITagProps extends TagProps {}

export const Tag: FC<ITagProps> = ({ children, ...restProps }) => {
  return <AntdTag {...restProps}>{children}</AntdTag>;
};
