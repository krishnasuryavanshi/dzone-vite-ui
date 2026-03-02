import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';
import { supplierDataParams } from '../types/supplier-dashboard';

export const fetchSupplierDashboardData = async ({
  startDate = '',
  endDate = '',
  listItemList = [],
  marketerList = [],
  campaignList = [],
}: supplierDataParams = {}) => {
  try {
    return nextBackendRequest({
      method: HttpMethod.GET,
      resource: ApiResources.SupplierDashboardDataUrl,
      apiHost: ApiHost.AnalyticsService,
      params: {
        start_date: startDate,
        end_date: endDate,
        line_item_ids: listItemList,
        marketer_names: marketerList,
        campaign_ids: campaignList,
      },
    });
  } catch (error) {
    throw error;
  }
};
