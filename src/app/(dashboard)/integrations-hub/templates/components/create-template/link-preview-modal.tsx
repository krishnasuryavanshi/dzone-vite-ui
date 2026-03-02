import React from 'react';
import { Modal } from '@/uicomponents/modal';
import { Flex, Space } from '@/uicomponents/layout';

interface LinkPreviewModalProps {
  url: string;
  open: boolean;
  onClose: () => void;
}

export const LinkPreviewModal: React.FC<LinkPreviewModalProps> = ({
  url,
  open,
  onClose,
}) => {
  return (
    <Modal open={open} onCancel={onClose} footer={null} width={800}>
      <Flex style={{ height: '600px', width: '100%' }}>
        <iframe
          src={url}
          title='Preview Web Form'
          style={{ width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
        />
      </Flex>
    </Modal>
  );
};
