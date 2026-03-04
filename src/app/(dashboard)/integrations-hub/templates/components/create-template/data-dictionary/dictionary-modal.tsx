import { Modal } from '@/uicomponents/modal';
import { FC, useEffect, useState } from 'react';
import { DictionaryModalHeader } from './dictionary-modal-header';
import { DictionaryModalBody } from './dictionary-modal-body';
import { ITemplateFieldDataType } from '../../../lib/types';

interface IDataDictionaryModalProps {
  openModal: boolean;
  closeDictionaryModal: () => void;
  dataDictionaryList: ITemplateFieldDataType[];
}

export const DataDictionaryModal: FC<IDataDictionaryModalProps> = ({
  openModal,
  closeDictionaryModal,
  dataDictionaryList,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsModalOpen(openModal);
  }, [openModal]);

  return (
    <Modal
      width={'70%'}
      title={<DictionaryModalHeader />}
      open={isModalOpen}
      onCancel={closeDictionaryModal}
      footer={null}
      closable={true}
    >
      <DictionaryModalBody dataDictionaryList={dataDictionaryList} />
    </Modal>
  );
};
