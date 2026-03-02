import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services';
import { IValidateLeads } from '../lib/types';

export const validateLeads = async (requestPayload: IValidateLeads) => {
  try {
    const data = await nextBackendRequest({
      resource: BackendResources.ValidateLeads,
      method: HttpMethod.POST,
      data: { ...requestPayload },
    });
    return data;
  } catch (error) {}
};
