import { BackendResources } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchLineItemHistory = async (
  lineItemId: string,
  params: { page: number; size: number; entityName: string },
) => {
  const resource = transformPath(BackendResources.LineItemHistory, {
    lineItemId,
  });
  try {
    const data = await nextBackendRequest({
      resource,
      params,
    });
    return { data };
  } catch (error) {}
};
