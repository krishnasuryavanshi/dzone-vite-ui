import { SyntheticEvent } from 'react';
import { ConfirmationDescription } from '../../components/show-page/confirmation-description';
import { ConfirmationFooter } from '../../components/show-page/confirmation-footer';
import { ConfirmationHeader } from '../../components/show-page/confirmation-header';
import { Flex } from '@/uicomponents/layout';

interface IConfirmationModal {
  className: string;
  onProceed: (event: SyntheticEvent) => void;
  onCancel: (event: SyntheticEvent) => void;
}
export const ConfirmationModal: React.FC<IConfirmationModal> = ({
  className,
  onProceed,
  onCancel,
}) => {
  return (
    <Flex vertical className={className}>
      <ConfirmationHeader title={'Are you sure you want to archive this campaign?'} />
      <ConfirmationDescription
        description={
          'Once archived, you won’t be able to change its status or book it in the future.'
        }
      />
      <ConfirmationFooter
        onCancel={onCancel}
        onProceed={onProceed}
        cancelLabel='Cancel'
        proceedLabel='Archive'
      />
    </Flex>
  );
};
