import { DzBox } from '@/components/layout/v1';
import { CLR_GRAY_5 } from '@/lib/constants';
import { ChatWidgetIcon } from '@/uicomponents/icons/svgs';
import { Flex } from '@/uicomponents/layout';
import React from 'react';

type SystemMessageWrapperProps = {
  children?: React.ReactNode;
};

export const SystemMessageWrapper = ({ children }: SystemMessageWrapperProps) => {
  return (
    <DzBox style={{ marginRight: '6rem' }}>
      <Flex gap={'0.5rem'} align='start'>
        <DzBox style={{ minHeight: '2rem' }}>
          <ChatWidgetIcon />
        </DzBox>
        <DzBox
          style={{
            borderRadius: '0px 10px 10px 10px',
            background: CLR_GRAY_5,
            padding: '0.5rem 1rem',
          }}
        >
          {children}
        </DzBox>
      </Flex>
    </DzBox>
  );
};
