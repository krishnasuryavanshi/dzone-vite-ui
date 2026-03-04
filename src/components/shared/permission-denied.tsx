import React, { FC } from 'react';
import { Result, Button } from '@/uicomponents';
import { useTranslation } from 'react-i18next';

interface PermissionDeniedProps {
  onRetry?: () => void;
}

export const PermissionDenied: FC<PermissionDeniedProps> = ({ onRetry }) => {
  const { t } = useTranslation();

  return (
    <Result
      status='403'
      title={t('Permission Denied')}
      subTitle={t('You do not have permission to access this resource.')}
      extra={
        onRetry && (
          <Button type='primary' onClick={onRetry}>
            {t('Retry')}
          </Button>
        )
      }
    />
  );
};
