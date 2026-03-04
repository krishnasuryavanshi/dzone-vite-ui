import { SkeletonButtonProps } from 'antd/lib/skeleton/Button';
import { Skeleton } from 'antd';
import React, { FC } from 'react';

const AntdSkeletonButton = Skeleton.Button;

export const SkeletonButton: FC<SkeletonButtonProps> = (props) => {
  return <AntdSkeletonButton {...props} />;
};
