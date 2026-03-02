import { DzBox } from '@/components/layout/v1';
import { DZENT_ICON_PURPLE } from '@/lib/constants';
import { AudioOutlined } from '@/uicomponents/icons';
import React from 'react';

export const MicButton = () => {
  return (
    <DzBox
      style={{ cursor: 'not-allowed' }}
      role='button'
      aria-label='Microphone input (currently disabled)'
      aria-disabled='true'>
      <AudioOutlined
        style={{
          color: DZENT_ICON_PURPLE,
          fontSize: '1.25rem',
          opacity: 0.5,
        }}
        aria-hidden='true'
      />
    </DzBox>
  );
};
