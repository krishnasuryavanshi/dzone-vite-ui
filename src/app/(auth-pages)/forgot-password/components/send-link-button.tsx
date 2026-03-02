import { Button } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import React, { FC } from 'react';
import { ILinkSent } from '../types';
import { Translate } from '@/components/i18n';
import { DZONE_CLR_BLACK } from '@/lib/constants';

interface ISendLinkButtonProps extends ILinkSent {}

export const SendLinkButton: FC<ISendLinkButtonProps> = ({ isLinkSent }) => {
  return (
    <Flex
      align='center'
      justify='center'
      style={{
        width: '100%',
        background: DZONE_CLR_BLACK,
        border: 'none',
        borderRadius: '3.125rem',
      }}>
      <Button
        size='large'
        style={{ border: 'none' }}
        block={true}
        htmlType='submit'>
        <Translate show={isLinkSent} i18nKey='form.forgotPassword.resend' />
        <Translate show={!isLinkSent} i18nKey='form.forgotPassword.next' />
      </Button>
    </Flex>
  );
};
