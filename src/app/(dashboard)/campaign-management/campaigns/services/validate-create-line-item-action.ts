import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services';

export default async function validateCreateLineItemAction(campaignId: string) {
  try {
    const data = await authenticatedRequest({
      resource: transformPath(ApiResources.ValidateCreateLineItemAction, { campaignId }),
      apiHost: ApiHost.CampaignService,
    });
    return data;
  } catch (error) {}
}
