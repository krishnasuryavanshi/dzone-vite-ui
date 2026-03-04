import { Translate } from '@/components/i18n';
import { Button } from '@/uicomponents';
import React, { FC } from 'react';

export interface ISaveButtonProps {
  onSubmit?: (values: any) => void;
  disabled?: boolean;
}

export const SaveButton: FC<ISaveButtonProps> = ({ onSubmit, disabled }) => {
  return (
    <Button
      onClick={onSubmit}
      type='primary'
      htmlType='submit'
      className='action submit'
      disabled={disabled}
    >
      <Translate i18nKey='form.actions.save' />
    </Button>
  );
};
