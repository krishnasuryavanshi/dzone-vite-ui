import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { Filters } from '@/lib/utils/table';
import { processFiltersWithDateRange } from '@/lib/utils/table';
import { authenticatedRequest } from '@/services';
import { ILineItem } from '../lib/types';
import { logError } from '@/services/logger';

export const fetchLineItems = async (
  page: number,
  size: number,
  campaignId?: string,
  filterInfo: Filters<ILineItem> = {},
) => {
  try {
    const filters = processFiltersWithDateRange(filterInfo);
    const hasFilters = filters.length > 0;
    const method = hasFilters ? HttpMethod.POST : HttpMethod.GET;
    const resource = hasFilters
      ? ApiResources.FilteredLineitems
      : ApiResources.LineItems;
    const requestBody = hasFilters ? { filters } : {};
    const requestConfig = {
      resource,
      apiHost: ApiHost.CampaignService,
      method,
      params: {
        page,
        size,
        campaignId,
      },
      data: requestBody,
    };

    const data = await authenticatedRequest(requestConfig);
    data.data = data.data.map((lineItem: ILineItem) => ({
      ...lineItem,
      campaignName: lineItem.campaign.name,
      pacing: lineItem?.pacing?.name,
    }));

    return data;
  } catch (error) {
    logError(error);
  }
};
