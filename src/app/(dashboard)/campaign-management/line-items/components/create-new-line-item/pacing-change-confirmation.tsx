import React from 'react';
import { Modal } from '@/uicomponents/modal';

interface PacingChangeConfirmationProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PacingChangeConfirmation: React.FC<PacingChangeConfirmationProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      open={visible}
      title='Confirm Pacing Change'
      okText='Yes, Continue'
      cancelText='Cancel'
      onOk={onConfirm}
      onCancel={onCancel}
      maskClosable={false}
      closable={false}
    >
      If you switch to No Pacing, you will not be able to enable Custom Pacing again for this line
      item. Do you want to continue?
    </Modal>
  );
};
