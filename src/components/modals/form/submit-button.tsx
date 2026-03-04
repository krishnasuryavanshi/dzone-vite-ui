import { CampaignStep } from '@/app/(dashboard)/campaign-management/campaigns/lib/enums';
import { Translate } from '@/components/i18n';
import { Button } from '@/uicomponents';
import React, { FC } from 'react';

export interface ISubmitButtonProps {
  onSubmit?: (values: any) => void;
  show?: boolean;
}

export const SubmitButton: FC<ISubmitButtonProps> = ({ onSubmit, show }) => {
  if (show === false) return null;
  return (
    <Button onClick={onSubmit} type='primary' htmlType='submit' className='action submit'>
      <Translate i18nKey='form.actions.submit' />
    </Button>
  );
};
