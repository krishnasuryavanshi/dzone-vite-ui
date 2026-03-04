import { FC, useState } from 'react';
import { useUpdateQueryState } from '../../../lib/hooks';
import { ICampaign } from '../../../campaigns/lib/types';
import { DzScrollContainer } from '@/components/layout/v1';
import { LineItemBreadCrumbContainer } from '../create-line-item/line-item-breadcrumb-container';
import { FormContainer } from './form-container';
import { ICreateLineItemBreadcrumbsProps } from '../create-line-item/line-item-breadcrumbs';
import { useCampaignDetailQuery } from '../../../campaigns/hooks';
import { useLineItemDetailQuery } from '../../hooks';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';

interface ICreateNewLineItemProps extends ICreateLineItemBreadcrumbsProps {
  userDetails?: any;
  tenantCode?: string | string[];
  isDzoneUser?: boolean;
  lineItemId?: string;
}

export const CreateNewLineItem: FC<ICreateNewLineItemProps> = ({
  userDetails,
  isDzoneUser,
  tenantCode,
  lineItemId,
  lineItemDetails,
}) => {
  const { queryState } = useUpdateQueryState();
  const queryClient = useQueryClient();
  const [localLineItemId, setLocalLineItemId] = useState<string | undefined>(
    lineItemId,
  );

  const { data: campaignResponse } = useCampaignDetailQuery(
    queryState?.campaignId ?? '',
  );
  const campaignData = (campaignResponse?.data as ICampaign) ?? ({} as ICampaign);

  const {
    data: lineItemResponse,
    isFetching: lineItemFetching,
  } = useLineItemDetailQuery(localLineItemId ?? '');

  // Use provided lineItemDetails as initial, then switch to query data once available
  const fetchedLineItemDetails = localLineItemId
    ? lineItemResponse?.data ?? lineItemDetails ?? {}
    : lineItemDetails ?? {};

  const loading = localLineItemId ? lineItemFetching && !lineItemResponse : false;

  const handleLineItemCreated = async (newLineItemId: string) => {
    setLocalLineItemId(newLineItemId);
    // Query will automatically fetch due to enabled changing
  };

  // Handle updates from drawer save - invalidate query to fetch fresh data
  const handleLineItemUpdated = async (updatedData: any) => {
    if (updatedData && localLineItemId) {
      // Use setTimeout to allow the backend to fully process the update
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.lineItems.detail(localLineItemId),
        });
      }, 500);
    }
  };

  return (
    <DzScrollContainer vertical scoll='outside'>
      <DzScrollContainer.Sticky>
        <LineItemBreadCrumbContainer
          {...{
            campaignData,
            id: fetchedLineItemDetails?.id,
            lineItemId: fetchedLineItemDetails?.lineItemId,
          }}
        />
      </DzScrollContainer.Sticky>
      <DzScrollContainer.Scroll>
        <FormContainer
          campaignUuid={campaignData?.id as string}
          campaignData={campaignData}
          tenantCode={tenantCode}
          lineItemDetails={fetchedLineItemDetails}
          lineItemId={localLineItemId}
          userId={userDetails?.userId}
          isDzoneUser={isDzoneUser}
          onCreateSuccess={handleLineItemCreated}
          onUpdateSuccess={handleLineItemUpdated}
          loading={loading}
        />
      </DzScrollContainer.Scroll>
    </DzScrollContainer>
  );
};
