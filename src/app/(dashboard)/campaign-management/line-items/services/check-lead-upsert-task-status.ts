import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string/transform-path';
import { nextBackendRequest } from '@/services';

export const checkLeadUpsertTaskStatus = async (requestId: string) => {
  try {
    const resource = transformPath(ApiResources.LeadUpsertTaskStatus, {
      requestId,
    });
    const response = await nextBackendRequest({
      resource,
      apiHost: ApiHost.PlatformService,
    });
    return response;
  } catch (error: any) {
    return { isError: true, error };
  }
};
