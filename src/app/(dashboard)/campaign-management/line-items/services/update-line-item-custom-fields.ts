import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { DzRecord } from '@/lib/types';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';

export const updateLineItemCustomFields = async (
  lineItemId: string,
  data: DzRecord,
) => {
  try {
    const resource = transformPath(ApiResources.UpdateLineItemCustomFields, {
      lineItemId,
    });
    const result = await authenticatedRequest({
      resource,
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.PUT,
      data,
    });

    return result;
  } catch (error) {
    logError(error);
    throw error;
  }
};
