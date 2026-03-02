import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchSearchCharactersMinLength = async () => {
  try {
    return nextBackendRequest({
      method: HttpMethod.GET,
      resource: BackendResources.LeadSearchMinCharacterLength,
    });
  } catch (error) {}
};
