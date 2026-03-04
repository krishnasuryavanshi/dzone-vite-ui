import { AvatarProps } from 'antd/lib/skeleton/Avatar';
import { Skeleton } from 'antd';
import React, { FC } from 'react';

const AntdSkeletonAvatar = Skeleton.Avatar;

export const SkeletonAvatar: FC<AvatarProps> = (props) => {
  return <AntdSkeletonAvatar {...props} />;
};
