import { authenticatedRequest } from '@/services/backend-request';
import { IPacingRequestData } from '../lib/types';
import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';

export const generatePacingChart = async (data: IPacingRequestData) => {
  try {
    return authenticatedRequest({
      resource: ApiResources.GeneratePacingChart,
      apiHost: ApiHost.CampaignService,
      method: HttpMethod.POST,
      data: { ...data },
    });
  } catch (error) {}
};
