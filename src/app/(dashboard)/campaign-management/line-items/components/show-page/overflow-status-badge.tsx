'use client';

import React from 'react';
import { Badge, Tooltip } from '@/components/uicomponents';
import { Space } from '@/components/uicomponents/layout';
import { InfoCircleOutlined } from '@/components/uicomponents/icons';

interface OverflowStatusBadgeProps {
  value: boolean;
}

export const OverflowStatusBadge: React.FC<OverflowStatusBadgeProps> = ({
  value,
}) => {
  if (!value) return null;

  return (
    <Space>
      <Badge
        status='warning'
        text='Overflow Enabled'
        style={{
          color: '#faad14',
          fontWeight: 600,
        }}
      />
      <Tooltip
        title='Lead overflow is enabled for this line item. All pacing caps are disabled, suppliers can publish leads without restrictions, and the line item is permanently in "No Pacing" mode. This action was logged for audit purposes.'
        placement='top'>
        <InfoCircleOutlined
          style={{
            color: '#faad14',
            fontSize: '0.875rem',
            cursor: 'help',
          }}
        />
      </Tooltip>
    </Space>
  );
};
