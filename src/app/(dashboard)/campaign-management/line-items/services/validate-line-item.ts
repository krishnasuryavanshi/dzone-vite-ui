import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services';

const Resource = BackendResources.ValidateLineItemById;

export async function validateLineItem(lineItemId: string) {
  try {
    const data = await nextBackendRequest({
      resource: transformPath(Resource, { lineItemId }),
    });
    return data;
  } catch (error) {}
}
