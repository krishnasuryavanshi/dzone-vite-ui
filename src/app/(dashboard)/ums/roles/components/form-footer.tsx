import { CancelButton } from '@/components/modals/form/cancel-button';
import { SaveButton } from '@/components/modals/form/save-button';
import { Flex } from '@/uicomponents/layout';
import { DebouncedFunc } from 'lodash';
import { FC } from 'react';
import { useEditStore } from '../stores';
import { LoaderButton } from '@/components/shared';

interface IFormFooterProps {
  handleCancel: () => void;
  handleSubmit: DebouncedFunc<() => Promise<void>>;
  isDisabled: boolean;
  loader: boolean;
}

export const FormFooter: FC<IFormFooterProps> = ({
  handleCancel,
  handleSubmit,
  isDisabled,
  loader,
}) => {
  const { isEditAllowed, isEditing } = useEditStore();
  return (
    <Flex justify='end' align='center' gap='0.875rem'>
      <CancelButton onCancel={handleCancel} />
      {(!isEditing || isEditAllowed) &&
        (loader ? <LoaderButton /> : <SaveButton onSubmit={handleSubmit} disabled={isDisabled} />)}
    </Flex>
  );
};
