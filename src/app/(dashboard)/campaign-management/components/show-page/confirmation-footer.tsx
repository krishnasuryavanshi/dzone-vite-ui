import { LoaderButton } from '@/components/shared';
import { Button } from '@/uicomponents/button';
import { Row } from '@/uicomponents/layout/grid';
import { SyntheticEvent } from 'react';

interface IConfirmationFooterProps {
  cancelLabel?: string;
  proceedLabel?: string;
  onProceed: (event: SyntheticEvent) => void;
  onCancel: (event: SyntheticEvent) => void;
  isLoading?: boolean;
}

export const ConfirmationFooter: React.FC<IConfirmationFooterProps> = ({
  onProceed,
  onCancel,
  cancelLabel,
  proceedLabel,
  isLoading,
}) => {
  return (
    <Row
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '1.25rem',
      }}
    >
      <Button style={{ marginRight: '0.5rem' }} onClick={onCancel}>
        {cancelLabel}
      </Button>
      {isLoading ? (
        <LoaderButton style={{ width: '7.375rem' }} />
      ) : (
        <Button type='primary' onClick={onProceed}>
          {proceedLabel}
        </Button>
      )}
    </Row>
  );
};
