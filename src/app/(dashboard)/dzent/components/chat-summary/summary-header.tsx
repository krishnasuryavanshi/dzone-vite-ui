import { Translate } from '@/components/i18n';
import { DzBox } from '@/components/layout/v1';
import { DZONE_PURPLE, DZENT_BORDER_LIGHT } from '@/lib/constants';
import { Text } from '@/uicomponents/text';
import React from 'react';

export const SummaryHeader = () => {
  return (
    <DzBox
      style={{
        borderBottom: `1px solid ${DZENT_BORDER_LIGHT}`,
        paddingBottom: '0.5rem',
        marginBottom: '0.5rem',
      }}
    >
      <Text strong underline style={{ color: DZONE_PURPLE }}>
        <Translate i18nKey='Chat Summary' />
      </Text>
    </DzBox>
  );
};
