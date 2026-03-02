import { Button } from '@/uicomponents';
import React, { FC, useEffect, useState } from 'react';
import { userResendSetPasswordLink } from '../services';
import { useQueryState } from '@/lib/hooks';
import { showNotification } from '@/services/notification';

export const ResendLinkAction: FC = () => {
  const { queryState } = useQueryState();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (queryState) {
      let { token } = queryState;
      if (token) {
        setToken(token);
      } else {
        setToken(null);
      }
    }
  }, [queryState]);

  const handleResendLink = async () => {
    try {
      const data = await userResendSetPasswordLink(token!);
      if (data?.success) {
        showNotification({
          type: 'success',
          message: data?.message,
        });
      }
    } catch (error) {}
  };

  if (!token) {
    return null;
  }

  return (
    <Button type='primary' onClick={handleResendLink}>
      Click here to request new link
    </Button>
  );
};
