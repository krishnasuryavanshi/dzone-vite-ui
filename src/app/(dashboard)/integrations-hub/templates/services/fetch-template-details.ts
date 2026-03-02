import { BackendResources } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchTemplateDetails = async (templateId: string) => {
  try {
    return nextBackendRequest({
      resource: transformPath(BackendResources.DeliveryTemplateById, {
        templateId,
      }),
    });
  } catch (error) {}
};
