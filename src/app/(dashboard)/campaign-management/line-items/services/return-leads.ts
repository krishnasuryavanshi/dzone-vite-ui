import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string/transform-path';
import { nextBackendRequest } from '@/services/backend-request';

export const returnLeads = async (
  lineItemId: string,
  leadIds: number[],
  returnReasons: string[],
) => {
  try {
    const resource = transformPath(ApiResources.ReturnLeads, { lineItemId });
    const result = await nextBackendRequest({
      resource,
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.POST,
      data: {
        ids: leadIds,
        returnReasons,
      },
    });

    return result;
  } catch (error) {}
};
