import { DzBox } from '@/components/layout/v1';
import React, { FC, PropsWithChildren } from 'react';
import { UploadProgress } from './upload-progress';
import { UploadNotification } from './upload-notification';
import { IDialogState } from '../../lib/types';

import './upload-dialog.scss';

interface IUploadDialogProps extends PropsWithChildren {
  dialogState: IDialogState;
  onClose: () => void;
}

export const UploadDialog: FC<IUploadDialogProps> = ({
  dialogState: { isDialogOpen, dialogType, progress, message },
  onClose,
  children,
}) => {
  if (!isDialogOpen) return null;
  return (
    <DzBox className={`dz-upload-dialog ${dialogType}`}>
      <DzBox className='dz-upload-dialog-content'>
        <UploadProgress show={dialogType === 'Progress'} progress={progress} />
        <UploadNotification
          show={dialogType === 'Success' || dialogType === 'Error'}
          message={message}
          type={dialogType}
          onClose={onClose}
        >
          {children}
        </UploadNotification>
      </DzBox>
    </DzBox>
  );
};
