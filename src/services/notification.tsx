
import { CheckCircleOutlined, WarningOutlined } from '@/uicomponents/icons';
import { notification } from '@/uicomponents/notification';
import { ReactNode } from 'react';

interface IShowNotification {
  message: string | ReactNode;
  messageHeader?: string;
  type?: 'error' | 'success';
  placement?: 'bottom' | 'top' | 'topRight';
  duration?: number;
}

export const showNotification = ({
  message,
  messageHeader,
  type = 'success',
  placement = 'topRight',
  duration,
}: IShowNotification) => {
  const CustomIcon =
    type === 'success' ? (
      <CheckCircleOutlined className='dz-notification-custom-icon success' />
    ) : (
      <WarningOutlined className='dz-notification-custom-icon error' />
    );
  notification[type]({
    message: messageHeader ? messageHeader : message,
    description: messageHeader ? message : null,
    placement,
    icon: CustomIcon,
    className: `dz-notification-alert dz-notification dz-alert dz-notification-message ${type} ${messageHeader ? 'has-header' : 'no-header'}`,
    duration,
  });
};
