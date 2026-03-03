import { ApiHost } from '@/lib/constants';
import { ApiResources, HttpMethod } from '@/lib/enums';
import { logger, logError } from './logger';
import { nextBackendRequest } from './backend-request';

export const fetchPermissions = async (request: { roleIds: string[] }) => {
  logger.debug('Permissions: fetching', { roleCount: request.roleIds.length });

  try {
    const data = await nextBackendRequest({
      apiHost: ApiHost.RBACService,
      resource: ApiResources.Permissions,
      method: HttpMethod.POST,
      data: {
        roleIds: request.roleIds,
      },
    });
    return data;
  } catch (error) {
    logError(error);
    return { isError: true, error };
  }
};
