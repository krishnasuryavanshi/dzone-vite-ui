'use client';
import { DzBox } from '@/components/layout/v1';
import { Text } from '@/uicomponents/text';
import { FC } from 'react';

export interface IRequiredBadgeProps {
  required: boolean;
}

export const RequiredBadge: FC<IRequiredBadgeProps> = ({ required }) => (
  <DzBox
    style={{
      background: '#EAF1FF',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
    }}>
    <Text
      text12
      style={{ color: '#235AED', fontWeight: 600, lineHeight: '1rem' }}>
      {required ? 'Required' : 'Optional'}
    </Text>
  </DzBox>
);
