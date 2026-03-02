import { Input } from '@/uicomponents/form/input';
import { FC } from 'react';

interface EmailInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const EmailInput: FC<EmailInputProps> = ({ ...rest }) => {
  return <Input type='email' {...rest} />;
};
