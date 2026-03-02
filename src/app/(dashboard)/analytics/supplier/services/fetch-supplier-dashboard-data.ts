import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
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
    const resource = transformPath(BackendResources.SupplierDashBoard, {
      startDate,
      endDate,
      listItemList,
      marketerList,
      campaignList,
    });
    return nextBackendRequest({
      method: HttpMethod.GET,
      resource,
    });
  } catch (error) {
    throw error;
  }
};
