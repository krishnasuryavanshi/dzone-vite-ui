import { useUnsavedDataStore } from '@/stores/unsaved-data-store';
import { StorageKey } from '@/lib/enums';
import { createCookieForExistingRecord } from '@/services/cookie-stepper-form';
import { FC, useEffect, useState } from 'react';
import { useUpdateQueryState } from '../../../lib/hooks';
import { LineItemFormContainer } from './line-item-form-container';
import { ICampaign } from '../../../campaigns/lib/types';
import { useCampaignDetailQuery } from '../../../campaigns/hooks';

interface ICreateLineItemProps {
  userDetails?: any;
  tenantCode?: string | string[];
  isDzoneUser?: boolean;
}

export const CreateLineItem: FC<ICreateLineItemProps> = ({
  userDetails,
  isDzoneUser,
  tenantCode,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { queryState, updateQueryParams } = useUpdateQueryState();
  const setSourceObject = useUnsavedDataStore((s) => s.setSourceObject);

  const { data: campaignResponse } = useCampaignDetailQuery(
    queryState?.campaignId ?? '',
  );
  const campaignData = (campaignResponse?.data as ICampaign) ?? ({} as ICampaign);

  useEffect(() => {
    setSourceObject({});
    createCookieForExistingRecord(StorageKey.LineItemForm, {});
    updateQueryParams(0);
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <LineItemFormContainer
      campaignData={campaignData}
      tenantCode={campaignData?.tenantCode || tenantCode}
      userId={userDetails?.userId}
      isDzoneUser={isDzoneUser}
    />
  );
};
