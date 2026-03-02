import { Translate } from '@/components/i18n';
import { DZONE_CLR_BLACK } from '@/lib/constants';
import { Button } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import React, { FC } from 'react';

interface ISignInButtonProps {
  isFullForm: boolean;
}

export const SignInButton: FC<ISignInButtonProps> = ({ isFullForm }) => {
  return (
    <Flex align='center' justify='center' style={{ paddingTop: '3rem' }}>
      <Button
        size='large'
        style={{
          background: DZONE_CLR_BLACK,
          border: 'none',
          borderRadius: '3.125rem',
        }}
        block={true}
        htmlType='submit'>
        <Translate i18nKey='form.login.signIn' show={isFullForm} />
        <Translate i18nKey='form.login.next' show={!isFullForm} />
      </Button>
    </Flex>
  );
};
