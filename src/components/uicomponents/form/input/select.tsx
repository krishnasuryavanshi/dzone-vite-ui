import React, { FC } from 'react';
import { Select as AntdSelect, SelectProps as AntdSelectProps } from 'antd';

interface ISelectProps extends AntdSelectProps<any> {}

const Select: FC<ISelectProps> & { Option: typeof AntdSelect.Option } = ({
  children,
  ...rest
}) => {
  return <AntdSelect {...rest}>{children}</AntdSelect>;
};

Select.Option = AntdSelect.Option;
export type { DefaultOptionType } from 'antd/es/select';
export { Select };
