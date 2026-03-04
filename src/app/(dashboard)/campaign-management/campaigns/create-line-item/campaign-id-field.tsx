import { Input } from '@/uicomponents/form/input';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents';
import React, { FC } from 'react';
import { Translate } from '@/components/i18n';

interface ICampaignIdFieldProps {
  value: string;
}

export const CampaignIdField: FC<ICampaignIdFieldProps> = ({ value }) => {
  return (
    <Flex vertical gap={'0.5rem'} style={{ width: '25%', paddingRight: '0.5rem' }}>
      <Text>
        <Translate i18nKey='pages.lineItems.label.campaignId' />
      </Text>
      <Input value={value} disabled size='large' />
    </Flex>
  );
};
