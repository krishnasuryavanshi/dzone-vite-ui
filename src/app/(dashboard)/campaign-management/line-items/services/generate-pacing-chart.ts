import { nextBackendRequest } from '@/services/backend-request';
import { IPacingRequestData } from '../lib/types';
import { BackendResources, HttpMethod } from '@/lib/enums';

export const generatePacingChart = async (data: IPacingRequestData) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.GeneratePacingChart,
      method: HttpMethod.POST,
      data: { ...data },
    });
  } catch (error) {}
};
