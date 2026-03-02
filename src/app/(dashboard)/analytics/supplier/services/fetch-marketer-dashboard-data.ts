import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';
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
    const resource = transformPath(BackendResources.MarketersDashBoard, {
      startDate,
      endDate,
      campaignList,
      supplierList,
      lineItemList,
      tenantCodes,
    });
    return nextBackendRequest({
      method: HttpMethod.GET,
      resource,
    });
  } catch (error) {
    throw error;
  }
};
