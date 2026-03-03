import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchAllUsers = async () => {
  try {
    const users = await authenticatedRequest({
      resource: ApiResources.AllUsers,
      apiHost: ApiHost.CampaignService,
    });
    return users.data.map((status: any) => {
      return {
        text: `${status.firstName} ${status.lastName}`,
        value: status.id,
      };
    });
  } catch (error) {}
};
