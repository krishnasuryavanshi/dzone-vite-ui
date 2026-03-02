import { FormItemProps } from 'antd/lib/form';
import { Form } from 'antd';
import React, { FC } from 'react'

interface IFormItemProps extends FormItemProps {
    children?: React.ReactNode
}

const {Item: AntdFormItem} = Form;

export const FormItem: FC<IFormItemProps> = ({children, ...rest}) => {
  return (
    <AntdFormItem {...rest}>{children}</AntdFormItem>
  )
}