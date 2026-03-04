import { DzBox } from '@/components/layout/v1';
import { showNotification } from '@/services/notification';
import { Button } from '@/uicomponents/button';
import React, { FC } from 'react';
import { publishLeads } from '../../services';
import { DZONE_CLR_BLACK } from '@/lib/constants';
import { Hideable, LoaderButton } from '@/components/shared';

interface IPublishLeadsProps {
  lineItemId: string;
  onSuccess: () => void;
  selectedLeads?: number[];
}

export const PublishLeads: FC<IPublishLeadsProps> = ({
  lineItemId,
  onSuccess,
  selectedLeads = [],
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handlePublishLeads = async () => {
    setIsLoading(true);
    try {
      const payload = {
        lineItemId,
        leadIds: selectedLeads,
      };
      const data = await publishLeads(payload);
      if (data?.message) {
        showNotification({
          type: 'success',
          message: data.message,
        });
      }
      onSuccess();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DzBox>
      <Button
        className='dz-btn-action-1'
        style={{
          height: '2rem',
        }}
        onClick={handlePublishLeads}
        disabled={isLoading}
        loading={isLoading}
      >
        {isLoading ? 'Publishing' : 'Publish'}
      </Button>
    </DzBox>
  );
};
