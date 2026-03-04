
import { useMemo } from 'react';
import { useLeadReviewFormConfigQuery } from '../../../line-items/hooks/use-lead-review-form-config-query';
import { ColumnDetailsResponse } from '../types';
import { transformApiResponseToColumns } from '../utils/transform-api-response';

// Re-export types for backward compatibility
export type {
  ColumnExtra,
  ColumnDetail,
  ColumnDetailsResponse,
} from '../types';

// Re-export FILTER_URL_MAP from transform utility
export { FILTER_URL_MAP } from '../utils/transform-api-response';

export const useLeadsColumnDetails = (lineItemId?: string) => {
  const {
    data: response,
    isLoading,
    error,
  } = useLeadReviewFormConfigQuery('grid', lineItemId);

  const columnDetails = useMemo<ColumnDetailsResponse | null>(() => {
    if (!response) return null;
    let dataToTransform = null;
    if (response?.data?.data) {
      dataToTransform = response.data.data;
    } else if (response?.data && Array.isArray(response.data)) {
      dataToTransform = response.data;
    } else if (Array.isArray(response)) {
      dataToTransform = response;
    }
    return dataToTransform ? transformApiResponseToColumns(dataToTransform) : null;
  }, [response]);

  return { columnDetails, isLoading, error: error as Error | null };
};
