import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchCampaignStatuses = async () => {
  try {
    const statuses = await nextBackendRequest({
      resource: BackendResources.CampaignStatuses,
    });
    return statuses.data.map((status: any) => {
      return {
        text: status.value,
        value: status.name,
      };
    });
  } catch (error) {}
};
