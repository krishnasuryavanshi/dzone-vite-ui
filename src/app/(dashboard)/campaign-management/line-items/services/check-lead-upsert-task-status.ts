import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export const checkLeadUpsertTaskStatus = async (requestId: string) => {
  try {
    const response = await nextBackendRequest({
      resource: BackendResources.LeadUpsertTaskStatus,
      params: {
        requestId,
      },
    });
    return response;
  } catch (error: any) {
    return { isError: true, error };
  }
};
