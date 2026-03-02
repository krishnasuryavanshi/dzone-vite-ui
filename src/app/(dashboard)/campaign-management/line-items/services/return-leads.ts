import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const returnLeads = async (
  lineItemId: string,
  leadIds: number[],
  returnReasons: string[],
) => {
  try {
    const result = await nextBackendRequest({
      resource: BackendResources.ReturnLeads,
      method: HttpMethod.POST,
      data: {
        lineItemId,
        leadIds,
        returnReasons,
      },
    });

    return result;
  } catch (error) {}
};
