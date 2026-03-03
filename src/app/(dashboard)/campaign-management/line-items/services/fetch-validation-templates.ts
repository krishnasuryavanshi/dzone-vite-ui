import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string/transform-path';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchValidationTemplates = async (orgCode: string) => {
  try {
    const resource = transformPath(ApiResources.ValidationTemplates, {
      orgCode,
    });
    const data = await authenticatedRequest({
      resource,
      apiHost: ApiHost.PlatformService,
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
