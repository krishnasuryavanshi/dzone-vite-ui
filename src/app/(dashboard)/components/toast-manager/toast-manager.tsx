import { FC, PropsWithChildren } from 'react';
import { ToastProgress } from './toast-progress';
import { DzBox } from '@/components/layout/v1';
import { ToastNotification } from './toast-notification';
import { IToastState } from '../../lib/types';
import './toast-manager.scss';

interface IToastManagerProps extends PropsWithChildren {
  dialogState: IToastState;
  onClose: () => void;
}

export const ToastManager: FC<IToastManagerProps> = ({
  dialogState: { isToastOpen, toastType, progress, message, header },
  onClose,
  children,
}) => {
  if (!isToastOpen) return null;
  return (
    <DzBox className={`dz-toast-manager ${toastType}`}>
      <DzBox className='dz-toast-manager-content'>
        <ToastProgress show={toastType === 'Progress'} progress={progress} title='' />
        <ToastNotification
          show={toastType === 'Success' || toastType === 'Error'}
          header={header}
          message={message}
          type={toastType}
          onClose={onClose}
        >
          {children}
        </ToastNotification>
      </DzBox>
    </DzBox>
  );
};
