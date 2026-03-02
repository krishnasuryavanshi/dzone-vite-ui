'use client';
import { FC, useEffect, useState } from 'react';
import { useUpdateQueryState } from '../../../lib/hooks';
import { ICampaign } from '../../../campaigns/lib/types';
import { fetchCampaignDetails } from '../../../campaigns/services';
import { DzScrollContainer } from '@/components/layout/v1';
import { LineItemBreadCrumbContainer } from '../create-line-item/line-item-breadcrumb-container';
import { FormContainer } from './form-container';
import { ICreateLineItemBreadcrumbsProps } from '../create-line-item/line-item-breadcrumbs';
import { fetchLineItem } from '../../services';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [campaignData, setCampaignData] = useState<ICampaign>({} as ICampaign);
  const [localLineItemId, setLocalLineItemId] = useState<string | undefined>(
    lineItemId,
  );
  const [fetchedLineItemDetails, setFetchedLineItemDetails] = useState<any>(
    lineItemDetails || {},
  );

  const fetchCampaignId = async () => {
    const data = await fetchCampaignDetails(queryState?.campaignId);
    setCampaignData(data?.data as ICampaign);
  };

  const handleLineItemCreated = async (newLineItemId: string) => {
    setLocalLineItemId(newLineItemId);
    // After creating line item, fetch its details to populate the form
    setLoading(true);
    const details = await fetchLineItem(newLineItemId);
    if (details?.data) {
      setFetchedLineItemDetails(details.data);
    }
    setLoading(false);
  };

  // Handle updates from drawer save - fetch fresh data after update
  const handleLineItemUpdated = async (updatedData: any) => {
    if (updatedData && localLineItemId) {
      // After drawer save, fetch fresh complete data
      // This ensures we get all fields including computed fields and related data
      setLoading(true);

      // Use setTimeout to allow the backend to fully process the update
      setTimeout(async () => {
        try {
          const freshDetails = await fetchLineItem(localLineItemId);
          if (freshDetails?.data) {
            setFetchedLineItemDetails(freshDetails.data);
          }
        } catch (error) {
          // Fallback to using the partial updated data
          setFetchedLineItemDetails(updatedData);
        } finally {
          setLoading(false);
        }
      }, 500); // 500ms delay to ensure backend has processed the update
    }
  };

  useEffect(() => {
    // If we have a lineItemId but no lineItemDetails (e.g., on page refresh), fetch the data
    if (localLineItemId && !lineItemDetails) {
      const fetchDetails = async () => {
        setLoading(true);
        const details = await fetchLineItem(localLineItemId);
        if (details?.data) {
          setFetchedLineItemDetails(details.data);
        }
        setLoading(false);
      };
      fetchDetails();
    } else if (lineItemDetails) {
      // Use provided details directly
      setFetchedLineItemDetails(lineItemDetails);
      setLoading(false);
    }
  }, [localLineItemId, lineItemDetails]);

  useEffect(() => {
    if (queryState?.campaignId) {
      fetchCampaignId();
    }
  }, [queryState?.campaignId]);

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
