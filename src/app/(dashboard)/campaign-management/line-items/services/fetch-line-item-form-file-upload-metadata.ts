import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';
import { LineItemFileUploadTypes } from '../lib/enums';

const LineItemFileUploadMetadataResources: Record<string, string> = {
  [LineItemFileUploadTypes.DeliveryTemplate]: ApiResources.LineItemDeliveryTemplateUploadMetaData,
  [LineItemFileUploadTypes.TargetAccountsList]: ApiResources.LineItemTALUploadMetaData,
  [LineItemFileUploadTypes.SuppressionsList]: ApiResources.LineItemSuppressionMetaData,
  [LineItemFileUploadTypes.JobTitlesList]: ApiResources.LineItemJobTitleFileMetaData,
  [LineItemFileUploadTypes.IntentKeywordsList]: ApiResources.LineItemInteKeywordFileMetaData,
  [LineItemFileUploadTypes.TechnologiesList]: ApiResources.LineItemTEchnologyFileMetaData,
};

export const fetchLineItemFormFileUploadMeta = async (
  type: LineItemFileUploadTypes
) => {
  try {
    const resource =
      LineItemFileUploadMetadataResources[type as keyof typeof LineItemFileUploadMetadataResources];
    return nextBackendRequest({
      resource: resource || ApiResources.LineItemsFileUploadMetaData,
      apiHost: ApiHost.CampaignService,
      params: {
        type,
      },
    });
  } catch (error) {}
};
