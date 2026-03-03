import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { ILineItem } from '../lib/types';
import { prepareViewData } from '../lib/utils/prepare-view-data';
import { fetchFileDetails, fetchMultipleFileDetails } from '../services';

export function useLineItemAdditionalDetailsQuery(
  lineItemData: ILineItem | undefined,
  restrictedFields: (string | false)[],
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.lineItems.additionalDetails(lineItemData?.id),
    queryFn: async () => {
      const data = lineItemData!;

      let assetFileIds: any[] = [];
      if (data.assetFileIds?.length) {
        const response = await fetchMultipleFileDetails(data.assetFileIds as string[]);
        assetFileIds = response?.data ?? [];
      }

      let deliveryTemplateDetails = {};
      if (data.deliveryTemplateId) {
        deliveryTemplateDetails = await fetchFileDetails(String(data.deliveryTemplateId));
      }

      const viewData = prepareViewData(data, { restrictedFields });
      return {
        ...viewData,
        assetFileIds,
        deliveryTemplateId: deliveryTemplateDetails,
      } as ILineItem;
    },
    enabled: !!lineItemData && enabled,
  });
}
