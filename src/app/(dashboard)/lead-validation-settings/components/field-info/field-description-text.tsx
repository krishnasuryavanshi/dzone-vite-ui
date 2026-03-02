import { DzBox } from '@/components/layout/v1';
import { Text } from '@/uicomponents/text';
import React from 'react';

type FieldDescriptionTextProps = {
  config: Record<string, any>;
};

export const FieldDescriptionText = ({ config }: FieldDescriptionTextProps) => {
  return (
    <DzBox style={{ paddingLeft: '0.5rem' }}>
      <Text style={{ fontSize: '0.875rem' }}>{config?.data || ''}</Text>
    </DzBox>
  );
};
