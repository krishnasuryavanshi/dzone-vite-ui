'use client';

import React from 'react';
import { FormTitle } from '@/components/shared/form';
import { Translate } from '@/components/i18n';
import { Flex, Space } from '@/uicomponents/layout';
import { Text } from '@/uicomponents';
import { Vector } from '@/uicomponents/icons/svgs';
import { CLR_WHITE } from '@/lib/constants';

export const Heading = () => {
  return (
    <Flex
      vertical
      align='center'
      gap={'0.5rem'}
      style={{ position: 'relative' }}>
      <FormTitle>
        <Translate i18nKey='pages.welcomeMessage' />
      </FormTitle>
      <Flex align='center' gap='0.5rem'>
        <Space
          style={{
            border: `2px solid ${CLR_WHITE}`,
            borderRadius: '3.125rem',
            padding: '0.5rem 2rem',
            display: 'inline-flex',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: CLR_WHITE,
              fontSize: '2.25rem',
              fontWeight: 500,
              lineHeight: 1,
            }}>
            DZ One
          </Text>
        </Space>
        <div
          style={{
            position: 'relative',
            width: '0.5rem',
            height: '0.5rem',
            background:
              'linear-gradient(109deg, #FFB8EC 4.89%, #F3D6FF 51.39%, #7D88FF 97.01%)',
            borderRadius: '50%',
            top: '1.5rem',
          }}
        />
      </Flex>
    </Flex>
  );
};
