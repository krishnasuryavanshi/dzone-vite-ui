import { Radio as AntdRadio } from 'antd';
import { RadioProps } from 'antd/lib';
import { FC, PropsWithChildren } from 'react';

interface IRadioProps extends PropsWithChildren, RadioProps {}

export const Radio: FC<IRadioProps> = ({ children, onChange, ...rest }) => {
  return (
    <AntdRadio
      onChange={onChange}
      {...rest}>
      {children}
    </AntdRadio>
  );
};

export const RadioGroup = AntdRadio.Group;
