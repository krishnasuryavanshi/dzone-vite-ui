import { FormProps } from 'antd/lib/form';
import { Form as AntdForm, FormInstance } from 'antd';
import React, { FC } from 'react';

interface IFormProps extends FormProps {
  children?: React.ReactNode;
}

export const Form: FC<IFormProps> = ({ children, ...rest }) => {
  return <AntdForm {...rest}>{children}</AntdForm>;
};

export const useForm = AntdForm.useForm;
export const useWatch = (namePath: string | string[], formInstance?: FormInstance) => {
  return AntdForm.useWatch(namePath, formInstance);
};
