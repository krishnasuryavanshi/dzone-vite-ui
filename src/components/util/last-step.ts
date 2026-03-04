import { CampaignValues } from '@/app/(dashboard)/campaign-management/campaigns/lib/utils';
import { LineItemStepValues } from '@/app/(dashboard)/campaign-management/line-items/lib/utils';

export const lastStep = (step?: number | string, title?: string) => {
  const isLastStepForCampaignForm =
    step !== undefined &&
    CampaignValues &&
    CampaignValues.length > 0 &&
    Number(step) === CampaignValues.length - 1;
  const isLastStepForCreateLineITem =
    step !== undefined &&
    LineItemStepValues &&
    LineItemStepValues.length > 0 &&
    Number(step) === LineItemStepValues.length - 1;
  return title === 'createLineItem' ? isLastStepForCreateLineITem : isLastStepForCampaignForm;
};
