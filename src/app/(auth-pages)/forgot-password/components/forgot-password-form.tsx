import { showNotification } from '@/services';
import { Form } from '@/uicomponents/form';
import { Flex } from '@/uicomponents/layout';
import { FC, PropsWithChildren } from 'react';
import { forgotPasswordConfig } from '../config';
import { ILinkSent } from '../types';
import { resetPassword } from '../services';

interface IForgotPasswordFormProps extends PropsWithChildren, ILinkSent {
  handleLinkSent: (isLinkSent: boolean) => void;
  handleSetVerifiedEmail: (email: string) => void;
  verifiedEmail: string;
}
export const ForgotPasswordForm: FC<IForgotPasswordFormProps> = ({
  children,
  isLinkSent,
  handleLinkSent,
  handleSetVerifiedEmail,
  verifiedEmail,
}) => {
  const { meta } = forgotPasswordConfig;

  const onFinish = async (values: any) => {
    const email = values.email && !isLinkSent ? values.email : verifiedEmail;
    try {
      const data = await resetPassword(email);
      if (data) {
        handleLinkSent(true);
        if (!isLinkSent) {
          handleSetVerifiedEmail(values.email);
        }
        showNotification({
          message: 'OTP sent successfully',
        });
      } else {
        showNotification({
          message: 'User not found',
          type: 'error',
        });
      }
    } catch {
      showNotification({
        message: 'User not found',
        type: 'error',
      });
    }
  };

  return (
    <Form {...meta} onFinish={onFinish}>
      <Flex vertical>{children}</Flex>
    </Form>
  );
};
