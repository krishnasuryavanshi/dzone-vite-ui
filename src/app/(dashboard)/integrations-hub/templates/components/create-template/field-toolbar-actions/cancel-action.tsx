import { Translate } from '@/components/i18n';
import { Button } from '@/uicomponents';
import { FC } from 'react';
import { useTemplateStore } from '../../../stores';

interface ICancelProps {
  onCancel?: () => void;
}

export const CancelAction: FC<ICancelProps> = ({ onCancel }) => {
  const { resetTemplateDetails } = useTemplateStore();
  const handleCancel = () => {
    resetTemplateDetails();

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Button
      size='small'
      onClick={handleCancel}
      style={{ border: '1px solid #ccc' }}>
      <Translate i18nKey='pages.templates.label.cancel' />
    </Button>
  );
};

// HOC for Cancel Button
const withDrawerCloseHandler = (CancelActionButton: FC<ICancelProps>) => {
  return function DraweCancelAction({
    closeFieldDrawer,
  }: {
    closeFieldDrawer: () => void;
  }) {
    const handleCancel = () => {
      closeFieldDrawer();
    };

    return <CancelActionButton onCancel={handleCancel} />;
  };
};

// HOC usage for drawer
export const DrawerCancelButton = withDrawerCloseHandler(CancelAction);
