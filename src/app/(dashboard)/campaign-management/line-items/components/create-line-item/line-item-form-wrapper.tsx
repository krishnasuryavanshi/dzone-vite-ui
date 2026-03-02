'use client';
import { FC } from 'react';
import { DzBox } from '@/components/layout/v1';
import { Flex } from 'antd';
import { LineItemForm } from './line-item-form';
import { LineItemStepsControl } from './line-item-steps-control';
import { StorageKey } from '@/lib/enums';
import { useSavedSteps } from '../../../lib/hooks';
import { useUpdateQueryState } from '../../../lib/hooks/use-update-query-state';
import { ICustomRangeDetails, ILineItem } from '../../lib/types';
import { ICampaign } from '../../../campaigns/lib/types';

interface ILineItemFormWrapper {
  campaignUuid?: string;
  campaignData?: ICampaign;
  tenantCode?: string | string[];
  lineItemDetails?: ILineItem;
  customRangeLimit: ICustomRangeDetails;
  userId?: string;
  isDzoneUser?: boolean;
}
export const LineItemFormWrapper: FC<ILineItemFormWrapper> = ({
  campaignUuid,
  campaignData,
  isDzoneUser,
  tenantCode,
  lineItemDetails,
  customRangeLimit,
  userId,
}) => {
  const { queryState, updateQueryParams } = useUpdateQueryState();

  const step = Number(queryState.step);

  const savedSteps = useSavedSteps(StorageKey.LineItemForm, step);
  const handleStepperChange = (key: number) => {
    if (key >= savedSteps.length) {
      return;
    }
    updateQueryParams(key);
  };

  return (
    <DzBox dzOneBox>
      <Flex vertical gap='0.75rem'>
        <LineItemStepsControl
          currentStep={step}
          savedSteps={savedSteps}
          handleStepperChange={handleStepperChange}
        />
        <LineItemForm
          step={step}
          campaignUuid={campaignUuid}
          campaignData={campaignData}
          tenantCode={tenantCode}
          lineItemDetails={lineItemDetails}
          customRangeLimit={customRangeLimit}
          userId={userId}
          isDzoneUser={isDzoneUser}
        />
      </Flex>
    </DzBox>
  );
};
