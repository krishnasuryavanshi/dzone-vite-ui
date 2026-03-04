import React from 'react';
import { Modal } from '@/uicomponents/modal';
import { Text } from '@/uicomponents';
import { Space, Flex } from '@/uicomponents/layout';
import { WarningOutlined } from '@/uicomponents/icons';

interface OverflowConfirmationProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const OverflowConfirmation: React.FC<OverflowConfirmationProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      open={visible}
      title={
        <Flex gap='small' align='center'>
          <WarningOutlined style={{ color: '#faad14', fontSize: '1.5rem' }} />
          <Text strong style={{ fontSize: '1.25rem' }}>
            Enable Lead Overflow
          </Text>
        </Flex>
      }
      okText='Yes, Enable Overflow'
      cancelText='Cancel'
      onOk={onConfirm}
      onCancel={onCancel}
      maskClosable={false}
      closable={false}
      okButtonProps={{
        style: {
          backgroundColor: '#323131',
          borderColor: '#323131',
          color: '#ffffff',
        },
      }}
    >
      <Space direction='vertical' size='middle'>
        <Text>
          <Text strong>Warning:</Text> Enabling overflow will:
        </Text>
        <Space direction='vertical' size='small'>
          <Text>• Switch this line item to &quot;No Pacing&quot; mode permanently</Text>
          <Text>• Allow suppliers to publish leads without any pacing restrictions</Text>
          <Text>• Disable editing of the &quot;Target Lead Goal&quot;</Text>
          <Text>• Be logged for audit purposes</Text>
        </Space>
        <Text type='danger' strong>
          This is an irreversible action and cannot be disabled once enabled.
        </Text>
        <Text>Do you want to continue?</Text>
      </Space>
    </Modal>
  );
};
