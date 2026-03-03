import React, { FC } from 'react';
import { BreadcrumbProps } from 'antd/lib/breadcrumb';
import { Breadcrumb as AntdBreadcrumb } from 'antd';
import { RightOutlined } from './icons';

interface IBreadcrumbProps extends BreadcrumbProps {}

export const Breadcrumb: FC<IBreadcrumbProps> = ({
  separator = (
    <RightOutlined
      style={{ fontSize: '0.875rem', width: '0.875rem', height: '0.875rem' }}
    />
  ),
  ...rest
}) => {
  return (
    <AntdBreadcrumb separator={separator} {...rest} className='dz-breadcrumb' />
  );
};
