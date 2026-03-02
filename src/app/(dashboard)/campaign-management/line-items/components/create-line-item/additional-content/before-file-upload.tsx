'use client';

import { DzBox } from '@/components/layout/v1';
import { Text } from '@/uicomponents/text';
import React, { FC } from 'react';

interface IBeforeFileUploadProps {}

export const BeforeFileUpload: FC<IBeforeFileUploadProps> = ({}) => {
  return (
    <DzBox style={{ marginRight: '0.5rem' }}>
      <Text
        style={{
          color: '#000',
          fontSize: '1.25rem',
          fontWeight: 600,
          wordBreak: 'normal',
        }}>
        Or
      </Text>
    </DzBox>
  );
};
