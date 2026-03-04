import { Flex } from '@/uicomponents/layout';
import React, { FC, PropsWithChildren } from 'react';
import { Heading } from './heading';
import './feature.scss';
import { DZONE_CLR_GRAY } from '@/lib/constants';

export const Feature: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Flex
      vertical
      justify='space-between'
      align='center'
      gap='3rem'
      style={{
        padding: '2.4rem 4.5rem',
        backgroundColor: `${DZONE_CLR_GRAY}`,
        borderRadius: '3.125rem',
        boxShadow: '0px 0px 16px 0px rgba(35, 90, 237, 0.16) inset',
        textAlign: 'center',
        position: 'relative',
      }}
      className='auth-feature-container'
    >
      <Heading />
      <Flex justify='center' vertical align='center' style={{ flexGrow: 1, width: '100%' }}>
        {children}
      </Flex>
    </Flex>
  );
};
