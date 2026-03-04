import { Translate } from '@/components/i18n';
import { Button } from '@/uicomponents';
import React, { FC } from 'react';

export interface ICancelButtonProps {
  onCancel: (values: any) => void;
  show?: boolean;
}

export const CancelButton: FC<ICancelButtonProps> = ({ onCancel, show }) => {
  if (show === false) return null;
  return (
    <Button onClick={onCancel} className='action cancel'>
      <Translate i18nKey='form.actions.cancel' />
    </Button>
  );
};
