import { CancelButton } from '@/components/modals/form/cancel-button';
import { CloneActionButton } from '@/components/modals/form/Clone-action-button';
import { CloneButton } from '@/components/modals/form/clone-button';
import { CloneEditButton } from '@/components/modals/form/clone-edit-button';
import { Flex } from '@/uicomponents/layout';
import { FC, SyntheticEvent } from 'react';

interface IModalFooterProps {
  loadingClone: boolean;
  loadingCloneEdit: boolean;
  handleCancel: (e: SyntheticEvent) => void;
  handleSubmit: (e: SyntheticEvent<Element, Event>, isEditing: boolean) => Promise<void>;
}

export const ModalFooter: FC<IModalFooterProps> = ({
  loadingClone,
  loadingCloneEdit,
  handleCancel,
  handleSubmit,
}) => {
  return (
    <Flex
      className='form-footer'
      justify='end'
      align='center'
      gap={'1rem'}
      style={{ marginTop: '1rem' }}
    >
      <CancelButton onCancel={handleCancel} />
      <CloneButton onSubmit={handleSubmit} loading={loadingClone} />
      <CloneEditButton onSubmit={handleSubmit} loading={loadingCloneEdit} />
    </Flex>
  );
};
