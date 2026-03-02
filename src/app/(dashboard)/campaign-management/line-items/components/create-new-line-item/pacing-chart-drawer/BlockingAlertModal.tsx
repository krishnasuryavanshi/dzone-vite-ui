'use client';

import React from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Text } from '@/components/uicomponents';

interface BlockingAlertModalProps {
  visible: boolean;
  allocationDifference: number;
  targetLeadGoal: number;
  currentTotal: number;
  onCancel: () => void;
  onProceed: () => void;
  onAutoAdjust: () => void;
}

export const BlockingAlertModal: React.FC<BlockingAlertModalProps> = ({
  visible,
  allocationDifference,
  targetLeadGoal,
  currentTotal,
  onCancel,
  onProceed,
  onAutoAdjust,
}) => (
  <Modal
    title={
      <Space>
        <ExclamationCircleOutlined style={{ color: '#faad14' }} />
        <Text strong>Lead Count Mismatch</Text>
      </Space>
    }
    open={visible}
    onCancel={onCancel}
    footer={[
      <Button key='cancel' onClick={onCancel}>
        Cancel
      </Button>,
      <Button key='auto' type='default' onClick={onAutoAdjust}>
        Auto-adjust
      </Button>,
      <Button key='proceed' type='primary' onClick={onProceed}>
        Proceed with {currentTotal} leads
      </Button>,
    ]}>
    <Space direction='vertical' size='middle' style={{ width: '100%' }}>
      <Text>
        The total lead count in the pacing chart ({currentTotal}) does not match
        your Target Lead Goal ({targetLeadGoal}).
      </Text>
      <Text type='warning'>
        There is a difference of {allocationDifference} leads.
      </Text>
      <Text>You can either:</Text>
      <ul style={{ marginLeft: '1.25rem' }}>
        <li>
          <Text>Auto-adjust the pacing to match your Target Lead Goal</Text>
        </li>
        <li>
          <Text>
            Proceed with the current total and update the Target Lead Goal
          </Text>
        </li>
        <li>
          <Text>Cancel and manually adjust the pacing</Text>
        </li>
      </ul>
    </Space>
  </Modal>
);
