import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchActiveCampaignPicklist = async () => {
  try {
    const resource = BackendResources.ActiveCampaignsList;
    const data = await nextBackendRequest({
      resource,
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
