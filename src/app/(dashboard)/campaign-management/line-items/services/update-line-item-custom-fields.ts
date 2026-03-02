import { BackendResources, HttpMethod } from '@/lib/enums';
import { DzRecord } from '@/lib/types';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';

export const updateLineItemCustomFields = async (
  lineItemId: string,
  data: DzRecord,
) => {
  try {
    const resource = transformPath(BackendResources.LineItemCustomFields, {
      lineItemId,
    });
    const result = await nextBackendRequest({
      resource,
      method: HttpMethod.PUT,
      data,
    });

    return result;
  } catch (error) {
    logError(error);
    throw error;
  }
};
