import { pick } from 'lodash';
import { CampaignField } from '../../campaigns/lib/enums';
import { ICampaign } from '../../campaigns/lib/types';
import { transformCollaboratorsValues } from './transform-collaborators-values';
import { transformResponseObject } from './transform-response-object';
import { transformResponseString } from './transform-response-string';
import { dateObject } from '@/lib/utils';
import dayjs from 'dayjs';

export const formatCampaignFormData = (data: ICampaign) => {
  // const fileDetailsKey = 'ioFileDetails';

  // const uploadedIOFile = data?.[fileDetailsKey]
  //   ? pick(data[fileDetailsKey], ['id', 'fileName'])
  //   : undefined;

  return {
    ...data,
    // [CampaignField.UploadIoFile]: uploadedIOFile,
    [CampaignField.Status]: transformResponseString(data?.status, 'status'),
    [CampaignField.CampaignGoals]: transformResponseObject(data?.campaignGoals),
    [CampaignField.PaymentTerm]: transformResponseString(data?.paymentTerm),
    [CampaignField.InvoicingTerm]: transformResponseString(data?.invoicingTerm),
    [CampaignField.DeliveryMethod]: transformResponseString(
      data?.deliveryMethod,
    ),
    [CampaignField.DeliveryDays]: transformResponseObject(data?.deliveryDays),
    [CampaignField.AssignedTo]: data?.collaborators?.assignedTo?.map(
      transformCollaboratorsValues,
    ),
    targetStartDate: data?.targetStartDate
      ? dayjs(data?.targetStartDate)
      : null,
    targetEndDate: data?.targetEndDate ? dayjs(data?.targetEndDate) : null,
    opportunityCloseDate: data?.opportunityCloseDate
      ? dayjs(data?.opportunityCloseDate)
      : null,
    createdAt: data?.createdAt ? dayjs(data?.createdAt) : null,
    updatedAt: data?.updatedAt ? dayjs(data?.updatedAt) : null,
    actualEndDate: data?.actualEndDate ? dateObject(data?.actualEndDate) : null,
    actualStartDate: data?.actualStartDate
      ? dateObject(data?.actualStartDate)
      : null,
  };
};
