import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';
import { DeliveryType } from '@/app/(dashboard)/integrations-hub/templates/lib/enums';

export interface DeliveryTemplateType {
  deliveryType: DeliveryType;
  deliveryFormat: string[] | null;
}

export interface DeliveryTemplateTypesResponse {
  data: DeliveryTemplateType[];
  message: string;
}

export const fetchDeliveryTemplateTypes =
  async (): Promise<DeliveryTemplateTypesResponse | null> => {
    try {
      const data = await nextBackendRequest({
        resource: BackendResources.DeliveryTemplateTypes,
        method: HttpMethod.GET,
      });
      return data;
    } catch (error) {
      logError(error);
      return null;
    }
  };
