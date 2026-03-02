import { UndoableNotification } from '@/components/notifications';
import { NotificationProvider } from '@/lib/types';
import { notification as staticNotification } from '@/uicomponents/notification';
import { App } from 'antd';
import { showNotification } from '../services';

export const notificationProvider: NotificationProvider = {
  open: ({
    key,
    message,
    type,
    cancelMutation,
    undoableTimeout,
    placement = 'bottom',
    className,
  }) => {
    const msg = (
      <UndoableNotification
        notificationKey={key}
        message={message}
        cancelMutation={() => {
          cancelMutation?.();
          staticNotification.destroy(key ?? '');
        }}
        undoableTimeout={undoableTimeout}
      />
    );
    staticNotification.open({
      key,
      message: type === 'progress' ? msg : message,
      placement,
      className,
      duration: 50,
    });
  },
  close: (key) => staticNotification.destroy(key),
};

export const useNotificationProvider = (): NotificationProvider => {
  const { notification: notificationFromContext } = App.useApp();
  const notification =
    'open' in notificationFromContext
      ? notificationFromContext
      : staticNotification;

  const notificationProvider: NotificationProvider = {
    open: ({ key, message, type, cancelMutation, undoableTimeout }) => {
      const msg = (
        <UndoableNotification
          notificationKey={key}
          message={message}
          cancelMutation={() => {
            cancelMutation?.();
            staticNotification.destroy(key ?? '');
          }}
          undoableTimeout={undoableTimeout}
        />
      );

      showNotification({
        message: type === 'progress' ? msg : message,
        type: type === 'error' ? 'error' : 'success',
      });
    },
    close: (key) => notification.destroy(key),
  };

  return notificationProvider;
};
