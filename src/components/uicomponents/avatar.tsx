import { AvatarProps } from 'antd/lib/avatar';
import { Avatar as AntdAvatar } from 'antd';
import React, { FC } from 'react'

export const Avatar: FC<AvatarProps> = ({children, ...rest}) => {
  return (
    <AntdAvatar {...rest}>{children}</AntdAvatar>
  )
}