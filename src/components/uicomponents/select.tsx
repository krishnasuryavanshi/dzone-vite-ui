import { SelectProps } from 'antd/lib/select';
import { Select as AntdSelect } from 'antd';
import React, { FC } from 'react';

export const Select: FC<SelectProps> = ({ children, ...rest }) => {
  return (
    <AntdSelect className='dz-progress' {...rest}>
      {children}
    </AntdSelect>
  );
};
