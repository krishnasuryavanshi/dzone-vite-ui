import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

interface IRequestData extends Record<string, unknown> {
  lineItemId: string;
  leadIds: number[];
}

export const publishLeads = async (data: IRequestData) => {
  try {
    const result = await nextBackendRequest({
      resource: BackendResources.PublishLeads,
      method: HttpMethod.POST,
      data,
    });

    return result;
  } catch (error) {}
};
