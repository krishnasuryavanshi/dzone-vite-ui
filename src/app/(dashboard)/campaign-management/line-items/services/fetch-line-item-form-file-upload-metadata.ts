import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';
import { LineItemFileUploadTypes } from '../lib/enums';

export const fetchLineItemFormFileUploadMeta = async (
  type: LineItemFileUploadTypes
) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.LineItemsFileUploadMetadata,
      params: {
        type,
      },
    });
  } catch (error) {}
};
