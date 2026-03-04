import { Modal } from '@/uicomponents';
import React, { FC } from 'react';
import { DilogHeader } from './dilog-header';
import { DilogBody } from './dilog-body';

interface ISaveTemplateDilogProps {
  openModal: boolean;
  handleCancel: () => void;
  handleActivity: (updating: boolean) => void;
}

export const SaveTemplateDilog: FC<ISaveTemplateDilogProps> = ({
  openModal,
  handleCancel,
  handleActivity,
}) => {
  return (
    <Modal
      width={'40%'}
      open={openModal}
      onCancel={handleCancel}
      title={<DilogHeader />}
      footer={null}
      destroyOnClose
      maskClosable={false}
    >
      <DilogBody handleClose={handleCancel} handleUpdate={handleActivity} />
    </Modal>
  );
};
