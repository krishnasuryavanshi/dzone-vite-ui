import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { Filters, processFiltersWithDateRange } from '@/lib/utils/table';
import { nextBackendRequest } from '@/services/backend-request';
import { ICampaign } from '../lib/types';
import { logError } from '@/services/logger';

export const fetchCampaigns = async (
  page: number,
  size: number,
  filterInfo?: Filters<ICampaign>,
) => {
  try {
    const filters = processFiltersWithDateRange(
      filterInfo as Filters<ICampaign>,
    );
    const hasFilters = filters.length > 0;
    const method = hasFilters ? HttpMethod.POST : HttpMethod.GET;
    const resource = hasFilters
      ? ApiResources.FilteredCampaigns
      : ApiResources.Campaigns;
    const requestBody = hasFilters ? { filters } : {};
    const requestConfig = {
      resource,
      apiHost: ApiHost.CampaignService,
      method,
      params: {
        page,
        size,
      },
      data: requestBody,
    };

    const data = await nextBackendRequest(requestConfig);
    data.data = data?.data.map((campaign: ICampaign) => ({
      ...campaign,
      campaignName: campaign.name,
    }));
    return data;
  } catch (error) {
    logError(error);
  }
};
