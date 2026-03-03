
import { Form as Login } from '@/uicomponents/form';
import { useLogin } from '@/lib/hooks/use-auth';
import { FC, PropsWithChildren } from 'react';
import { loginConfig } from '../config';
import { IUserIdentity } from '../types';

interface ILoginFormProps extends PropsWithChildren {
  onFormModeChange: (value: boolean) => void;
  initialValues?: IUserIdentity;
  loginForm: any;
}

export const LoginForm: FC<ILoginFormProps> = ({
  onFormModeChange,
  initialValues,
  loginForm,
  children,
}) => {
  const { mutate: login } = useLogin();
  const { meta } = loginConfig;

  const onSubmit = async (values: any) => {
    if (values.email && !values.password) {
      onFormModeChange(true);
      return;
    }
    if (values.email && values.password) {
      login(values);
    }
  };

  return (
    <Login
      form={loginForm}
      {...meta}
      {...(initialValues && { initialValues })}
      onFinish={onSubmit}
      style={{ textAlign: 'left', width: '100%' }}>
      {children}
    </Login>
  );
};
