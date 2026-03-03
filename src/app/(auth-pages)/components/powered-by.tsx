
import React from 'react';
import { Text } from '@/uicomponents';
import { Translate } from '@/components/i18n';
import { CLR_WHITE } from '@/lib/constants';

export const PoweredBy = () => {
  return (
    <Text
      style={{ color: CLR_WHITE, fontSize: '1.125rem', marginTop: '0.5rem' }}>
      <Translate i18nKey='pages.poweredBy' />
    </Text>
  );
};
