import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const updateLineItemCollaborators = async (
  data: Record<string, string[]>,
  lineItemId: string,
) => {
  try {
    const resource = transformPath(
      BackendResources.UpdateLineItemCollaborators,
      {
        lineItemId,
      },
    );
    return nextBackendRequest({
      resource,
      method: HttpMethod.PUT,
      data,
    });
  } catch (error) {}
};
