import {
  BillingReportType,
  PerformanceReportType,
  ReachReportType,
} from '../lib/enums';
import { ApiHost } from '@/lib/constants';
import { ApiResources, HttpMethod } from '@/lib/enums';
import { ChartsReports } from '@/public/mock/charts-reports';
import { nextBackendRequest } from '@/services';
import { IExecutiveFilterDataPayload, IFilterDataPayload } from '../lib/utils';

const ReportChartsResources = {
  [PerformanceReportType.InternalRejectRate]:
    ApiResources.DashboardChartsInternalRejectRate,
  [PerformanceReportType.MarketerReturnRate]:
    ApiResources.DashboardChartsClientRejectRate,
  [PerformanceReportType.LeadStatus]: ApiResources.DashboardChartsLeadStatus,
  [BillingReportType.NoOfBillableLeads]:
    ApiResources.DashboardChartsNoOfBillableLeads,
  [BillingReportType.DollarAmountForBillableLeads]:
    ApiResources.DashboardChartsDollarAmountForBillableLeads,
  [ReachReportType.LeadsByJobTitle]:
    ApiResources.DashboardChartsLeadsByJobTitle,
  [ReachReportType.LeadsByCountry]: ApiResources.DashboardChartsLeadsByCountry,
  [ReachReportType.Pacing]: ApiResources.DashboardChartsPacing,
  [PerformanceReportType.InternalRejectionReasons]:
    ApiResources.DashboardChartsInternalRejectReasons,
};

export async function fetchReportChartsData(
  filters: IFilterDataPayload | IExecutiveFilterDataPayload,
  type: string
) {
  const resource =
    ReportChartsResources[type as keyof typeof ReportChartsResources];

  if (!resource) {
    return { data: ChartsReports[type as keyof typeof ChartsReports] };
  }

  const data = await nextBackendRequest({
    apiHost: ApiHost.ReportingService,
    resource,
    method: HttpMethod.POST,
    data: { ...filters, type },
  });
  return data;
}
