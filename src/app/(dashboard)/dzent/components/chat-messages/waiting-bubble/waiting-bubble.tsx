import { DzBox } from '@/components/layout/v1';
import React from 'react';
import { SystemMessageWrapper } from '../system-message';

import './waiting-bubble.scss';
import { useDzentStore } from '../../../store';
import { Hideable } from '@/components/shared';

export const WaitingBubble = () => {
  const { isWaitingForResponse } = useDzentStore();
  return (
    <Hideable show={isWaitingForResponse}>
      <SystemMessageWrapper>
        <DzBox className='three-dot-waiting-bubble'>
          <span className='dot dot-1'></span>
          <span className='dot dot-2'></span>
          <span className='dot dot-3'></span>
        </DzBox>
      </SystemMessageWrapper>
    </Hideable>
  );
};
