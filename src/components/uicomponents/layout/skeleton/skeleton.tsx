import { SkeletonProps } from 'antd/lib/skeleton';
import { Skeleton as AntdSkeleton } from 'antd';
import React, { FC, PropsWithChildren } from 'react';

const { Input, Avatar } = AntdSkeleton;

export const Skeleton: FC<PropsWithChildren<SkeletonProps>> = ({ children, loading, ...rest }) => {
  if (loading) {
    return <AntdSkeleton active {...rest} />;
  }
  return <>{children}</>;
};

export { Input, Avatar };
