import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchSearchCharactersMinLength = async () => {
  try {
    return authenticatedRequest({
      method: HttpMethod.GET,
      resource: ApiResources.LeadsSearchMinCharacterLength,
      apiHost: ApiHost.CampaignService,
    });
  } catch (error) {}
};
