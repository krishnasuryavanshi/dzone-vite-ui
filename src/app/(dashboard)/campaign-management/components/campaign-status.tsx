import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents';

import React, { CSSProperties } from 'react';
import { IStatus } from '../lib/types';
import { StatusMetaLineItems } from '../line-items/lib/utils';

const Status = ({
  name,
  value,
  iconStyles,
}: {
  name: string;
  value: string;
  iconStyles?: CSSProperties;
}) => {
  if (!value) return null;

  const currentStatus = StatusMetaLineItems({ value });

  if (!currentStatus) return null;

  const styles: CSSProperties = {
    backgroundColor: currentStatus.backgroundColor,
    color: currentStatus.color,
    padding: '0.5rem',
    borderRadius: '4px',
    height: '2rem',
    width: '11rem',
    boxShadow: '0px 0px 4px rgba(35, 90, 237, 0.16)',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <Flex align='center' style={styles} gap={'0.5rem'}>
      <span style={{ ...iconStyles, color: currentStatus.color }}>{currentStatus.icon}</span>
      <Text
        style={{
          fontWeight: 400,
          color: currentStatus.color,
        }}
        text14
      >
        {value}
      </Text>
    </Flex>
  );
};

interface ICampaignStatusProps {
  status: IStatus;
}

export const CampaignStatus: React.FC<ICampaignStatusProps> = ({ status }) => {
  if (status?.name === 'LIVE') {
    return <Status name={status?.name} value={status?.value} iconStyles={{ height: '1.25rem' }} />;
  }
  return <Status name={status?.name} value={status?.value} />;
};
