import { Flex } from '@/uicomponents/layout';
import { Text, Title } from '@/uicomponents';
import React, { FC } from 'react';
import { Hideable } from '@/components/shared';
import { ResendLinkAction } from './resend-link-action';
import { ContactSupportAction } from './contact-support-action';
import { DzBox } from '@/components/layout/v1';
import { PasswordLinkExpired } from '@/uicomponents/icons/svgs';

interface IPasswordLinkExpiredContainerProps {
  attemptCount: number;
}

export const PasswordLinkExpiredContainer: FC<
  IPasswordLinkExpiredContainerProps
> = ({ attemptCount }) => {
  return (
    <Flex justify='center' align='center' style={{ height: '100%' }}>
      <Flex
        vertical
        gap={'3rem'}
        align='center'
        justify='center'
        style={{ width: '25rem' }}>
        <Title level={3} style={{ textAlign: 'center' }}>
          Password Set Up Link Expired
        </Title>

        <DzBox style={{ paddingTop: '3rem' }}>
          <PasswordLinkExpired />
        </DzBox>

        <Text style={{ fontSize: '1.25rem', textAlign: 'center' }}>
          Login link access expires after 24 hour and can only be used once.
        </Text>

        <Hideable show={attemptCount === 1}>
          <ResendLinkAction />
        </Hideable>

        <Hideable show={attemptCount > 1}>
          <ContactSupportAction />
        </Hideable>
      </Flex>
    </Flex>
  );
};
