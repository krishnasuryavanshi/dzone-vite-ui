import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import {
  fetchLeadValidationSettingMetadata,
  fetchLineItemsLeadValidationSetting,
  fetchMarketersLeadValidationSetting,
} from '../services';

export function useValidationSettingConfigQuery(
  isEditing: boolean,
  info: Record<string, string | null> | null,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.validationSettings.config(isEditing, info),
    queryFn: async () => {
      if (!isEditing) {
        return fetchLeadValidationSettingMetadata();
      }

      if (
        info?.tenantCode &&
        info?.leadValidationSettingId &&
        !info?.lineItemId
      ) {
        return fetchMarketersLeadValidationSetting(
          info.tenantCode,
          info.leadValidationSettingId,
        );
      }

      if (
        !info?.tenantCode &&
        info?.leadValidationSettingId &&
        info?.lineItemId
      ) {
        return fetchLineItemsLeadValidationSetting(
          info.lineItemId,
          info.leadValidationSettingId,
        );
      }

      throw new Error('Invalid configuration params');
    },
    enabled,
  });
}
