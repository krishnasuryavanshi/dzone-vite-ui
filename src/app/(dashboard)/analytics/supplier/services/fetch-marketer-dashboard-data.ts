import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';
import { MarketerDataParams } from '../types/supplier-dashboard';

export const fetchMarketerDashboardData = async ({
  startDate = '',
  endDate = '',
  campaignList = [],
  supplierList = [],
  lineItemList = [],
  tenantCodes = [],
}: MarketerDataParams = {}) => {
  try {
    return authenticatedRequest({
      method: HttpMethod.GET,
      resource: ApiResources.MarketersDashboardDataUrl,
      apiHost: ApiHost.AnalyticsService,
      params: {
        start_date: startDate,
        end_date: endDate,
        campaign_ids: campaignList,
        supplier_names: supplierList,
        line_item_ids: lineItemList,
        tenantCodes,
      },
    });
  } catch (error) {
    throw error;
  }
};
