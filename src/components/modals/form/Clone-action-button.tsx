import { Translate } from '@/components/i18n';
import { Button, Spin } from '@/uicomponents';
import { LoadingOutlined } from '@/uicomponents/icons';
import React, { FC, SyntheticEvent } from 'react';

export interface ICloneButtonProps {
  onSubmit: (
    e: SyntheticEvent<Element, Event>,
    isEditing: boolean,
  ) => Promise<void>;
  show?: boolean;
  loading: boolean;
  isEditing: boolean;
}

export const CloneButtonText: FC = () => (
  <Translate i18nKey='form.actions.clone' />
);
export const CloneAndEditButtonText: FC = () => (
  <Translate i18nKey='form.actions.cloneAndEdit' />
);

export const CloneActionButton: FC<ICloneButtonProps> = ({
  onSubmit,
  show,
  loading,
  isEditing,
}) => {
  if (show === false) return null;
  return (
    <Button
      onClick={(e) => onSubmit(e, isEditing)}
      type='primary'
      htmlType='submit'
      className='action submit'
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {loading ? (
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 24, color: '#fff' }} spin />
          }
          style={{ width: isEditing ? '5.375rem' : '2.5rem' }}
        />
      ) : isEditing ? (
        <CloneAndEditButtonText />
      ) : (
        <CloneButtonText />
      )}
    </Button>
  );
};
