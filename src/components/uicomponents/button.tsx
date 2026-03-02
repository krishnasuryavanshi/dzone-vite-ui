import { ButtonProps } from 'antd/lib/button'
import React, { FC } from 'react'
import { Button as AntdButton } from 'antd'

export const Button: FC<ButtonProps> = ({children, ...rest}) => {
  return (
    <AntdButton {...rest}>{children}</AntdButton>
  )
}