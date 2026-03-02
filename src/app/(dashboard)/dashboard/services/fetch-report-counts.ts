import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services';
import { IExecutiveFilterDataPayload, IFilterDataPayload } from '../lib/utils';

export async function fetchReportCountsData(
  filters: IFilterDataPayload | IExecutiveFilterDataPayload,
  type: string
) {
  const data = await nextBackendRequest({
    resource: BackendResources.ReportCounts,
    method: HttpMethod.POST,
    data: { ...filters },
    params: { type },
  });

  return data;
}
