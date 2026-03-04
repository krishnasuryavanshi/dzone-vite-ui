import { DzBox } from '@/components/layout/v1';
import { CLR_WHITE, DZONE_PURPLE } from '@/lib/constants';
import { UserOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import React from 'react';

type UserMessageWrapperProps = {
  children?: React.ReactNode;
};

export const UserMessageWrapper = ({ children }: UserMessageWrapperProps) => {
  return (
    <DzBox style={{ marginLeft: '6rem', alignSelf: 'flex-end' }}>
      <Flex gap={'0.5rem'} align='start'>
        <DzBox
          style={{
            borderRadius: '20px 0px 20px 20px',
            background: DZONE_PURPLE,
            padding: '0.5rem 1rem ',
            color: CLR_WHITE,
          }}
        >
          {children}
        </DzBox>
      </Flex>
    </DzBox>
  );
};
