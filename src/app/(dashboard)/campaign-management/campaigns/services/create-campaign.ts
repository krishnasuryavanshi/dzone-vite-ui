import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const createCampaign = async (data: any) => {
  try {
    return nextBackendRequest({
      resource: ApiResources.Campaigns,
      apiHost: ApiHost.CampaignService,
      method: HttpMethod.POST,
      data,
    });
  } catch (error) {}
};

export const postCreateCampaign = async (data: any) => {
  try {
    return nextBackendRequest({
      resource: ApiResources.Campaigns,
      apiHost: ApiHost.CampaignService,
      method: HttpMethod.POST,
      data,
    });
  } catch (error) {}
};

export const putCreateCampaign = async (data: any, campaignId: string) => {
  try {
    return nextBackendRequest({
      resource: transformPath(ApiResources.CampaignsById, { campaignId }),
      apiHost: ApiHost.CampaignService,
      method: HttpMethod.PUT,
      data,
    });
  } catch (error) {}
};
