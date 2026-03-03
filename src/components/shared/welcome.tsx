
import { Space } from '@/uicomponents/layout';
import React from 'react';

export const Welcome = () => {
  return (
    <Space
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <span className='welcome-text' data-testid='welcome-text'>
        Welcome to the DZ One Platform
      </span>
    </Space>
  );
};

export default Welcome;
