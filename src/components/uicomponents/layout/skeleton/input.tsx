import { SkeletonInputProps } from 'antd/lib/skeleton/Input';
import { Skeleton } from 'antd';
import React, { FC } from 'react';

const AntdSkeletonInput = Skeleton.Input;

export const SkeletonInput: FC<SkeletonInputProps> = (props) => {
  return (
    <AntdSkeletonInput {...props} />
  )
}