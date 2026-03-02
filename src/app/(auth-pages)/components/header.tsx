import React from 'react';
import { Logo } from './logo';
import { Flex } from '@/uicomponents/layout';
import { PoweredBy } from './powered-by';

export const Header = () => {
  return (
    <Flex vertical align='center'>
      <PoweredBy />
      <Logo />
    </Flex>
  );
};
