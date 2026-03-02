import { ApiHost } from '@/lib/constants';
import { ApiResources } from '@/lib/enums';
import { apiRequest } from '@/services';

export async function fetchFileUploadMeta() {
  try {
    const { data } = await apiRequest({
      apiHost: ApiHost.CampaignService,
      resource: ApiResources.FileUploadMetadata,
      params: { fileTypeName: 'lead-file' },
    });
    return { data };
  } catch (error) {
    return { isError: true, error };
  }
}
