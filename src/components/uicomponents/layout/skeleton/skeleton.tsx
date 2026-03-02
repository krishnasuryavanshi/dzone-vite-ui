import { SkeletonProps } from "antd/lib/skeleton";
import { Skeleton as AntdSkeleton } from "antd";
import React, { FC } from "react";

const { Input, Avatar } = AntdSkeleton;

export const Skeleton: FC<SkeletonProps> = ({ children, ...rest }) => {
  return <AntdSkeleton {...rest}>{children}</AntdSkeleton>;
};

export { Input, Avatar };
