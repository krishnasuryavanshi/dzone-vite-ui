import { Translate } from '@/components/i18n';
import { Flex, Space } from '@/uicomponents/layout';
import { Link } from '@/uicomponents/link';
import { useState } from 'react';
import { showNotification } from '@/services';
import { useRouter } from '@/lib/hooks/use-router';
import { validateCampaign } from '../../campaigns/services';
import { LoadingOutlined } from '@/uicomponents/icons';
import { validateLineItem } from '../../line-items/services';
import { HasPermission } from '@/components/auth';
import { CampaignActionsEnum, LineItemActionsEnum } from '@/lib/enums/permissions';
import { HistoryDrawer } from './history-drawer';
import { Text } from '@/components/uicomponents';
import { DZONE_CLR_BLACK } from '@/lib/constants';

export const ShowDetailsSectionFooterAction = ({
  isCollapsed,
  handleCollapse,
  updateLink,
  itemUuid,
  marketerCode,
  type,
  formConfig,
}: {
  isCollapsed: boolean;
  handleCollapse: (collapsedState: boolean) => void;
  formConfig?: any;
  updateLink: string;
  itemUuid?: string;
  marketerCode?: string;
  type: 'campaign' | 'lineItem';
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false); // State for drawer

  const validateCampaignDetails = async () => {
    setIsLoading(true);
    try {
      const data =
        type === 'campaign'
          ? await validateCampaign(itemUuid as string)
          : await validateLineItem(itemUuid as string);
      if (data?.data) {
        router.replace(updateLink);
      }
    } catch (error) {
      showNotification({ message: error as string, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const onClose = () => {
    setIsHistoryDrawerOpen(false);
  };

  return (
    <Flex justify='space-between' align='center'>
      <Space style={{ margin: '0.5rem 0 0.25rem 0' }}>
        <Text strong>Basic Details</Text>
      </Space>
      <Flex justify='end' gap='0.75rem' style={{ marginTop: '0.5rem' }}>
        {type !== 'campaign' && (
          <Link className='dz-link' onClick={() => setIsHistoryDrawerOpen(true)}>
            <Translate i18nKey='History' />
          </Link>
        )}
        <HasPermission
          permissions={type === 'campaign' ? CampaignActionsEnum.Edit : LineItemActionsEnum.Edit}
        >
          <Link
            className='dz-link'
            onClick={(e) => {
              e.stopPropagation();
              validateCampaignDetails();
            }}
          >
            {isLoading ? (
              <LoadingOutlined style={{ color: DZONE_CLR_BLACK }} />
            ) : (
              <Translate i18nKey='Edit' />
            )}
          </Link>
        </HasPermission>
        {!isCollapsed ? (
          <Link className='dz-link' onClick={() => handleCollapse(true)}>
            <Translate i18nKey='View Less' />
          </Link>
        ) : (
          <Link className='dz-link' onClick={() => handleCollapse(false)}>
            <Translate i18nKey='View More' />
          </Link>
        )}
      </Flex>
      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        marketerCode={marketerCode}
        formConfig={formConfig}
        onClose={onClose}
        lineItemId={itemUuid as string}
      />
    </Flex>
  );
};
