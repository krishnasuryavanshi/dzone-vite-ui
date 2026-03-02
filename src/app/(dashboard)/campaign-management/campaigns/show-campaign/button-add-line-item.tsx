import { Translate } from '@/components/i18n';
import { showNotification } from '@/services';
import { Button } from '@/uicomponents';
import { useParams, useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { validateCreateLineItemsAction } from '../services';
import { LoadingOutlined } from '@/uicomponents/icons';

interface IButtonAddLineItemProps {}

export const ButtonAddLineItem: FC<IButtonAddLineItemProps> = ({}) => {
  const { campaignId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const createLineItemUrl = `/campaign-management/line-items/create?campaignId=${campaignId}`;
  const validateCreateLineItemAction = async () => {
    setIsLoading(true);
    try {
      const data = await validateCreateLineItemsAction(campaignId as string);
      if (data?.data) {
        router.replace(createLineItemUrl);
      }
    } catch (error) {
      showNotification({ message: error as string, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      type='primary'
      className='dz-btn-action-1'
      size='small'
      style={{ width: '7.5rem' }}
      disabled={isLoading}
      onClick={(e) => {
        e.stopPropagation();
        validateCreateLineItemAction();
      }}>
      {isLoading ? (
        <LoadingOutlined />
      ) : (
        <Translate i18nKey='pages.campaigns.label.addLineItem' />
      )}
    </Button>
  );
};
