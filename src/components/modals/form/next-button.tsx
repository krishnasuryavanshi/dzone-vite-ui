import { Translate } from '@/components/i18n';
import { Button } from '@/uicomponents';
import React, { FC } from 'react';

export interface INextButtonProps {
  onNext?: (values: any) => void;
  show?: boolean;
}

export const NextButton: FC<INextButtonProps> = ({ onNext, show }) => {
  if (show === false) return null;
  return (
    <Button onClick={onNext} type='primary' className='action submit'>
      <Translate i18nKey='form.actions.next' />
    </Button>
  );
};
