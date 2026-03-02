import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';
import { LineItemFileUploadTypes } from '../lib/enums';

const UploadFileResources: Record<string, string> = {
  [LineItemFileUploadTypes.DeliveryTemplate]: ApiResources.LineItemDeliveryTemplateUpload,
  [LineItemFileUploadTypes.TargetAccountsList]: ApiResources.LineItemTALFileUpload,
  [LineItemFileUploadTypes.SuppressionsList]: ApiResources.LineItemSupressionFileUpload,
  [LineItemFileUploadTypes.JobTitlesList]: ApiResources.LineItemJobTitleListFielUpload,
  [LineItemFileUploadTypes.IntentKeywordsList]: ApiResources.LineItemIntentKeyworkdFileUpload,
  [LineItemFileUploadTypes.TechnologiesList]: ApiResources.LineItemTechnologyFileUpload,
};

export const fetchLineItemFormFileUpload = async (formData: FormData) => {
  try {
    const type = formData.get('type') as string;
    const resource = UploadFileResources[type] || ApiResources.LineItemSingleFileUpload;
    const data = await nextBackendRequest({
      resource,
      apiHost: ApiHost.CampaignService,
      method: HttpMethod.POST,
      headers: {
        'Content-Type': 'multipart/form-data',
      } as any,
      data: formData as any,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
