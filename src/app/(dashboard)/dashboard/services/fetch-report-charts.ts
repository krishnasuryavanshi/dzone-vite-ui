import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services';
import { IExecutiveFilterDataPayload, IFilterDataPayload } from '../lib/utils';

export async function fetchReportChartsData(
  filters: IFilterDataPayload | IExecutiveFilterDataPayload,
  type: string
) {
  const data = await nextBackendRequest({
    resource: BackendResources.ReportCharts,
    method: HttpMethod.POST,
    data: { ...filters },
    params: { type },
  });
  return data;
}
