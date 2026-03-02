'use client';

import React from 'react';
import { Result } from '../uicomponents';
import { ClockCircleOutlined } from '@/uicomponents/icons';

interface ComingSoonProps {
  title?: string;
  description?: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  title = 'Coming Soon',
  description = 'This feature is under development and will be available soon.',
}) => {
  return (
    <Result
      icon={<ClockCircleOutlined style={{ fontSize: 72, color: '#1890ff' }} />}
      title={title}
      subTitle={description}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    />
  );
};
