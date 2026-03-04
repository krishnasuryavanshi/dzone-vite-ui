import React, { FC, SyntheticEvent } from 'react';
import { CloneActionButton } from './Clone-action-button';

export interface ICloneButtonProps {
  onSubmit: (e: SyntheticEvent<Element, Event>, isEditing: boolean) => Promise<void>;
  loading: boolean;
}

export const CloneEditButton: FC<ICloneButtonProps> = ({ onSubmit, loading }) => {
  return <CloneActionButton onSubmit={onSubmit} loading={loading} isEditing={true} />;
};
