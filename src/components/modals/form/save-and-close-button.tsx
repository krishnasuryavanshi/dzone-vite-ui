import { Translate } from '@/components/i18n';
import { Button } from '@/uicomponents';
import React, { FC } from 'react';

export interface ISaveAndCloseButtonProps {
  onSaveAndClose?: (values: any) => void;
  show?: boolean;
}

export const SaveAndCloseButton: FC<ISaveAndCloseButtonProps> = ({
  onSaveAndClose,
  show,
}) => {
  if (show === false) return null;
  return (
    <Button
      onClick={onSaveAndClose}
      className="action cancel">
      <Translate i18nKey="form.actions.saveAndClose" />
    </Button>
  );
};
