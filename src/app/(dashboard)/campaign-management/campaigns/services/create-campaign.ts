import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const createCampaign = async (data: any) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.Campaigns,
      method: HttpMethod.POST,
      data,
    });
  } catch (error) {}
};

export const postCreateCampaign = async (data: any) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.Campaigns,
      method: HttpMethod.POST,
      data,
    });
  } catch (error) {}
};

const Resource = BackendResources.Campaigns;

export const putCreateCampaign = async (data: any, campaignId: string) => {
  try {
    return nextBackendRequest({
      resource: `${Resource}/${campaignId}`,
      method: HttpMethod.PUT,
      data,
    });
  } catch (error) {}
};
