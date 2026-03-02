import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string/transform-path';
import { nextBackendRequest } from '@/services/backend-request';

interface IRequestData extends Record<string, unknown> {
  lineItemId: string;
  leadIds: number[];
}

export const publishLeads = async (data: IRequestData) => {
  try {
    const resource = transformPath(ApiResources.PublishLeads, {
      lineItemId: data.lineItemId,
    });
    const result = await nextBackendRequest({
      resource,
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.POST,
      data: { leadIds: data.leadIds },
    });

    return result;
  } catch (error) {}
};
