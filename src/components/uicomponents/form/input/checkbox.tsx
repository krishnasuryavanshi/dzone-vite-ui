import React, { FC, PropsWithChildren } from 'react';
import { Checkbox as AntdCheckbox } from 'antd';
import { CheckboxProps } from 'antd/lib';

interface ICheckboxProps extends PropsWithChildren, CheckboxProps {
  onChange?: (e: any) => void;
  className?: string;
}

export const Checkbox: FC<ICheckboxProps> = ({
  children,
  onChange,
  ...rest
}) => {
  return (
    <AntdCheckbox onChange={onChange} {...rest}>
      {children}
    </AntdCheckbox>
  );
};

export const CheckboxGroup = AntdCheckbox.Group;
