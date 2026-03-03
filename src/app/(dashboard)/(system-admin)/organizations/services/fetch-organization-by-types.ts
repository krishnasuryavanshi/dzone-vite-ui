import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';
import { TenantTypeEnum } from '@/app/(dashboard)/ums/users/lib/enums';

export const fetchOrganizationsByType = async (
  types: string,
  userId?: string,
) => {
  try {
    const resource = transformPath(ApiResources.OrganizationsByTypes, {
      types,
    });
    const params: Record<string, string> = {};
    if (types !== TenantTypeEnum.SUPPLIER) {
      params.userId = types === TenantTypeEnum.MARKETER && userId ? userId : '';
    }
    const data = await authenticatedRequest({
      apiHost: ApiHost.RBACService,
      resource,
      params,
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
