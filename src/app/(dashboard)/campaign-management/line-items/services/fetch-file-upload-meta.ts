import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services';

export const fetchFileUploadMeta = async () => {
  try {
    const data = await nextBackendRequest({
      resource: ApiResources.FileUploadMetadata,
      apiHost: ApiHost.CampaignService,
      params: { fileTypeName: 'lead-file' },
    });

    return data;
  } catch (error) {}
};
