import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';
import { transformPath } from '@/lib/utils/string';
import { DeliveryType } from '@/app/(dashboard)/integrations-hub/templates/lib/enums';

export interface DeliveryTemplate {
  id: string;
  name: string;
  integrationId?: string;
}

export interface DeliveryTemplateListResponse {
  data: DeliveryTemplate[];
  message: string;
}

export const fetchDeliveryTemplateList = async (
  deliveryType: DeliveryType,
): Promise<DeliveryTemplateListResponse | null> => {
  try {
    const resource = transformPath(BackendResources.DeliveryTemplateList, {
      deliveryType,
    });
    const data = await nextBackendRequest({
      resource,
      method: HttpMethod.GET,
    });
    return data;
  } catch (error) {
    logError(error);
    return null;
  }
};
