import { PopoverProps } from 'antd/lib/popover';
import { Popover as AntdPopover } from 'antd';
import React, { FC } from 'react'

export const Popover: FC<PopoverProps> = ({children, ...rest}) => {
  return (
    <AntdPopover {...rest}>{children}</AntdPopover>
  )
}