import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents';
import React, { FC, PropsWithChildren } from 'react';
import {
  CheckCircleOutlined,
  CloseOutlined,
  WarningOutlined,
} from '@/uicomponents/icons';
import './toast-notification.scss';

interface IToastNotificationProps extends PropsWithChildren {
  header: string;
  message?: string;
  show: boolean;
  type: string;
  onClose?: () => void;
}

export const ToastNotification: FC<IToastNotificationProps> = ({
  show,
  type,
  message,
  header,
  onClose,
  children,
}) => {
  if (!show) return null;
  return (
    <Flex vertical gap='1rem' className={`dz-one-toast-notification ${type}`}>
      <Flex align='flex-start' gap='0.75rem'>
        {type === 'Success' ? (
          <CheckCircleOutlined className='icon success' />
        ) : (
          <WarningOutlined className='icon error' />
        )}
        <Flex vertical gap='0.25rem'>
          <Text className='text' strong style={{ fontSize: '1rem' }}>
            {header}
          </Text>
          <Text className='text' style={{ fontSize: '0.875rem' }}>
            {message}
          </Text>
        </Flex>
        <CloseOutlined
          color='#000'
          style={{ cursor: 'pointer', marginLeft: 'auto' }}
          onClick={onClose}
        />
      </Flex>
      <Flex justify='center' flex={1}>
        {children}
      </Flex>
    </Flex>
  );
};
