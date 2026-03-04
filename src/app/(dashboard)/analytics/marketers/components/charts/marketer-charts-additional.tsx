import { Translate } from '@/components/i18n';
import { Text } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';

interface IMarketerChartsAdditionalProps {
  label: string;
}

export const ChartsAdditional: FC<IMarketerChartsAdditionalProps> = ({ label }) => {
  return (
    <Flex gap='0.5rem' align='center'>
      <div
        style={{
          height: '0.5rem',
          width: '0.375rem',
          borderRadius: '1px',
          backgroundColor: '#3D71FB',
        }}
      />
      <Text style={{ fontSize: '0.75rem', fontWeight: 400 }}>
        <Translate i18nKey={label} />
      </Text>
    </Flex>
  );
};
