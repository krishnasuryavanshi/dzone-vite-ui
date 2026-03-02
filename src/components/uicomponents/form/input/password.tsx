import { InputProps } from 'antd/lib/input';
import { Input } from 'antd';
import React, { FC } from 'react'

const { Password: AntdInputPassword } = Input;

export const InputPassword: FC<InputProps> = ({children, ...rest}) => {
  return (
    <AntdInputPassword {...rest}>{children}</AntdInputPassword>
  )
}