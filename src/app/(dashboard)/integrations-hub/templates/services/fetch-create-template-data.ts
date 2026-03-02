import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchCreateTemplateData = async (lineItemId: string) => {
  try {
    const { data } = await nextBackendRequest({
      resource: BackendResources.DeliveryTemplateCoreData,
      params: { lineItemId },
    });
    return { data };
  } catch (error) {}
};
