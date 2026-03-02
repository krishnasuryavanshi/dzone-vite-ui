import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchAllUsers = async () => {
  try {
    const users = await nextBackendRequest({
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
