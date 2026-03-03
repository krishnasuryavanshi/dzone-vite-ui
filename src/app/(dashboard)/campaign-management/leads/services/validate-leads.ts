import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services';
import { IValidateLeads } from '../lib/types';

export const validateLeads = async (requestPayload: IValidateLeads) => {
  try {
    const data = await authenticatedRequest({
      resource: ApiResources.LeadsValidation,
      apiHost: ApiHost.LeadOrchestrationService,
      method: HttpMethod.POST,
      data: { ...requestPayload },
    });
    return data;
  } catch (error) {}
};
