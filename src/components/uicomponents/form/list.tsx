import { Form } from 'antd';
import { FormListProps } from 'antd/lib/form';
import { FC } from 'react';

interface IFormListProps extends FormListProps {}

const { List: AntdFormList } = Form;

export const FormList: FC<IFormListProps> = ({ children, ...rest }) => {
  return <AntdFormList {...rest}>{children}</AntdFormList>;
};
