import { Translate } from '@/components/i18n';
import React, { FC, SyntheticEvent } from 'react';
import { CloneActionButton } from './Clone-action-button';

export interface ICloneButtonProps {
  onSubmit: (
    e: SyntheticEvent<Element, Event>,
    isEditing: boolean,
  ) => Promise<void>;
  loading: boolean;
}

export const CloneButtonText: FC = () => (
  <Translate i18nKey='form.actions.clone' />
);
export const CloneAndEditButtonText: FC = () => (
  <Translate i18nKey='form.actions.cloneAndEdit' />
);

export const CloneButton: FC<ICloneButtonProps> = ({ onSubmit, loading }) => {
  return (
    <CloneActionButton
      onSubmit={onSubmit}
      loading={loading}
      isEditing={false}
    />
  );
};
