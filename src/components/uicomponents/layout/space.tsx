import { Space as AntdSpace } from 'antd'
import { SpaceProps } from 'antd/lib/space'
import React, { FC } from 'react'

export const Space: FC<SpaceProps> = ({children, ...rest}) => {
  return (
    <AntdSpace {...rest}>{children}</AntdSpace>
  )
}