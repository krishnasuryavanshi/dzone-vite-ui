import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const updateTemplateDetails = async (
  templateId: string,
  data: Record<string, any>,
) => {
  try {
    return nextBackendRequest({
      resource: transformPath(BackendResources.DeliveryTemplateById, {
        templateId,
      }),
      method: HttpMethod.PUT,
      data,
    });
  } catch (error) {}
};
