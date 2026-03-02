import { InputNumber } from '@/uicomponents/form/input';
import { FC } from 'react';

interface NumberInputProps {
  placeholder?: string;
  value?: number;
}

export const NumberInput: FC<NumberInputProps> = ({ ...rest }) => {
  return <InputNumber {...rest} style={{ width: '100%' }} />;
};
