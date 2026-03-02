import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services';

const Resource = BackendResources.ValidateCampaignById;

export async function validateCampaign(campaignId: string) {
  try {
    const data = await nextBackendRequest({
      resource: transformPath(Resource, { campaignId }),
    });
    return data;
  } catch (error) {}
}
