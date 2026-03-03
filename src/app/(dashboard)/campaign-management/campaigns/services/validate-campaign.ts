import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services';

export async function validateCampaign(campaignId: string) {
  try {
    const data = await authenticatedRequest({
      resource: transformPath(ApiResources.ValidateCampaignById, { campaignId }),
      apiHost: ApiHost.CampaignService,
    });
    return data;
  } catch (error) {}
}
