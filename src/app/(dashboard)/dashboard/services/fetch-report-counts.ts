import { ExecutiveReportType, PerformanceCountsType, ReachCountsType } from '../lib/enums';
import { ApiHost } from '@/lib/constants';
import { ApiResources, HttpMethod } from '@/lib/enums';
import { StatsReports } from '@/public/mock/stats-reports';
import { authenticatedRequest } from '@/services';
import { IExecutiveFilterDataPayload, IFilterDataPayload } from '../lib/utils';

const ReportCountResources = {
  [PerformanceCountsType.NumberOfContactsGenerated]: ApiResources.DashboardStatsNoOfCantacts,
  [PerformanceCountsType.NumberOfLeadsDelivered]: ApiResources.DashboardStatsNoOfLeadsDelivered,
  [PerformanceCountsType.PercentageOfContactsThatBecomeDeliverableLeads]:
    ApiResources.DashboardStatsDeliverableLeadsPercentage,
  [PerformanceCountsType.AverageTimeFromCampaignCreationToFirstLeadDelivery]:
    ApiResources.DashboardStatsAvgTimeFirstLeadDelivery,
  [PerformanceCountsType.AverageTimeFromContactResearchToQualityAudit]:
    ApiResources.DashboardStatsAvgTimeResearchToAudit,
  [PerformanceCountsType.AverageTimeFromQaReadyToLeadDelivery]:
    ApiResources.DashboardStatsAvgTimeQaToDelivery,
  [ReachCountsType.LeadsDelivered]: ApiResources.DashboardStatsNoOfLeadsDelivered,
  [ReachCountsType.UniqueAccountsReached]: ApiResources.DashboardStatsUniqueAccountReached,
  [ExecutiveReportType.Bookings]: ApiResources.DashboardExecutiveBookings,
  [ExecutiveReportType.WaitingToGoLive]: ApiResources.DashboardExecutiveWatingToGoLive,
};

export async function fetchReportCountsData(
  filters: IFilterDataPayload | IExecutiveFilterDataPayload,
  type: string,
) {
  const resource = ReportCountResources[type as keyof typeof ReportCountResources];

  if (!resource) {
    return { data: StatsReports[type as keyof typeof StatsReports] };
  }

  const data = await authenticatedRequest({
    apiHost: ApiHost.ReportingService,
    resource,
    method: HttpMethod.POST,
    data: { ...filters, type },
  });

  return data;
}
