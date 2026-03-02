import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchLineItemHistory = async (
  lineItemId: string,
  params: { page: number; size: number; entityName: string },
) => {
  const resource = transformPath(ApiResources.LineItemHistory, {
    entity_type: params.entityName,
    entity_id: lineItemId,
  });
  try {
    const data = await nextBackendRequest({
      resource,
      apiHost: ApiHost.AuditService,
      params: { page: params.page, size: params.size },
    });
    return { data };
  } catch (error) {}
};
