import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';

export interface TransformationHistoryItem {
  id: string;
  file: {
    id: string;
    filename: string;
  } | null;
  template: {
    id: string;
    name: string;
  };
  status: 'PENDING' | 'PROCESSING' | 'FAILED' | 'ERROR' | 'SUCCESS';
  errorMessage: string | null;
}

export interface TransformationHistoryResponse {
  page: number;
  size: number;
  total: number;
  data: TransformationHistoryItem[];
}

export const fetchTransformationHistory = async (
  lineItemId: string,
  page: number = 1,
  size: number = 10,
): Promise<TransformationHistoryResponse | null> => {
  try {
    const resource = transformPath(BackendResources.TranformationHistory, {
      lineItemId,
    });
    const response = await nextBackendRequest({
      resource,
      method: HttpMethod.GET,
      params: {
        page,
        size,
      },
    });
    return response?.data;
  } catch (error) {
    logError(error);
    return null;
  }
};
