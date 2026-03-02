/**
 * Auth pages layout — visual wrapper for login/forgot-password.
 * Auth redirect is handled by AuthLayout in the router.
 */
import { Flex } from '@/uicomponents/layout';
import React, { PropsWithChildren } from 'react';
import './layout.scss';
import { Copyright, Feature, AuthPageLayout, Header } from './components';
import { Text } from '@/uicomponents/text';
import { Translate } from '@/components/i18n';
import { CLR_WHITE } from '@/lib/constants';

export default function PageLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <Flex
      vertical
      justify='space-between'
      align='center'
      gap='3rem'
      className='auth-layout-container'>
      <AuthPageLayout>
        <Text style={{ color: CLR_WHITE, fontSize: '1.6875rem' }}>
          <Translate i18nKey='pages.demandGenHelper' />
        </Text>
        <Feature>{children}</Feature>
        <Header />
        <Copyright />
      </AuthPageLayout>
    </Flex>
  );
}
