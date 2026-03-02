import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';
import {
  Filters,
  Sorter,
  processFiltersWithDateRange,
} from '@/lib/utils/table';
import { IOrganization } from '../lib/types';

export const fetchOrganizations = async (
  page: number,
  size: number,
  filterInfo?: Filters<IOrganization>,
  sorterInfo?: Sorter<IOrganization>,
) => {
  // Build filters array using utility that handles date range objects
  const filters = processFiltersWithDateRange(filterInfo || {});

  // Build sort param (uppercase ASC/DESC)
  const sorter = Array.isArray(sorterInfo) ? sorterInfo[0] : sorterInfo;
  const sortField = sorter?.field as string;
  const sortOrder = sorter?.order;
  const sort =
    sortField && sortOrder
      ? `${sortField},${sortOrder === 'ascend' ? 'ASC' : 'DESC'}`
      : undefined;

  const params: Record<string, any> = { page, size };
  if (sort) params.sort = sort;

  try {
    return nextBackendRequest({
      apiHost: ApiHost.RBACService,
      resource: ApiResources.FilteredOrganizations,
      method: HttpMethod.POST,
      params,
      data: { filters },
    });
  } catch (error) {}
};
