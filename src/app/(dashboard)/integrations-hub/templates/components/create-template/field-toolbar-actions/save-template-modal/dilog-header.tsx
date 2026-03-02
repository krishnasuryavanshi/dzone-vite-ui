import { Translate } from '@/components/i18n';
import { DZONE_CLR_BLACK, CLR_WHITE } from '@/lib/constants';
import { Title, Text } from '@/uicomponents';
import { SaveOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';

interface IDilogHeaderProps {}

export const DilogHeader: FC<IDilogHeaderProps> = ({}) => {
  return (
    <Flex gap='0.5rem' align='flex-start'>
      <SaveOutlined
        style={{
          background: `${DZONE_CLR_BLACK}`,
          borderRadius: '50%',
          color: `${CLR_WHITE}`,
          padding: '8px',
        }}
      />
      <Flex vertical>
        <Title level={4} style={{ margin: 0, fontWeight: 500 }}>
          <Translate i18nKey='Save Template' />
        </Title>
        <Text style={{ fontSize: '0.875rem', fontWeight: 400 }}>
          <Translate i18nKey='This template is already in use, across other Line Items. Choose Carefully from the below options' />
        </Text>
      </Flex>
    </Flex>
  );
};
