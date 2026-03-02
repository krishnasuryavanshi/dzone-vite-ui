import { DzBox } from '@/components/layout/v1';
import { DzRecord } from '@/lib/types';
import { Text } from '@/uicomponents/text';
import React from 'react';

type FieldNoteProps = {
  config: DzRecord;
};

export const FieldNote = ({ config }: FieldNoteProps) => {
  return (
    <DzBox style={{ paddingLeft: '0.5rem' }}>
      <Text style={{ fontSize: '0.875rem' }} strong>
        {config?.data?.header || ''}{' '}
      </Text>{' '}
      <Text style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
        {config?.data?.text || ''}{' '}
      </Text>
    </DzBox>
  );
};
