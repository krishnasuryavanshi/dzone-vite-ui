import { Title } from '@/uicomponents';
import React, { FC } from 'react';
import { ILinkSent } from '../types';
import { Translate } from '@/components/i18n';

interface IForgotPasswordTitleProps extends ILinkSent {}

export const ForgotPasswordTitle: FC<IForgotPasswordTitleProps> = ({ isLinkSent }) => {
  return (
    <Title
      level={4}
      style={{
        marginBottom: '1rem',
        color: '#fff',
        fontWeight: 500,
        fontSize: '1.5rem',
      }}
    >
      <Translate i18nKey='form.forgotPassword.headingCheckYourEmailInbox' show={isLinkSent} />
      <Translate i18nKey='form.forgotPassword.headingResetPassword' show={!isLinkSent} />
    </Title>
  );
};
