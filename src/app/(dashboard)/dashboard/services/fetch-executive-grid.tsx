import { ApiHost } from '@/lib/constants';
import { ApiResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services';
import { IExcecutiveGrids } from '../components/reporting-tabs/executive/types';
import { Filters } from '@/lib/utils/table';

export async function fetchExecutiveGrid(
  page: number,
  size: number,
  status: Filters<IExcecutiveGrids> | null | undefined,
) {
  try {
    const requestData: any = { page, size };
    if (status && Object.keys(status).length > 0) {
      requestData.status = status;
    }

    const data = await nextBackendRequest({
      apiHost: ApiHost.ReportingService,
      resource: ApiResources.DashboardExecutiveGrid,
      method: HttpMethod.POST,
      data: requestData,
    });

    return data;
  } catch (error) {}
}
