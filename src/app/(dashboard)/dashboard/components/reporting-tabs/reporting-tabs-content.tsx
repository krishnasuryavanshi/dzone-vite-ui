import { FC } from 'react';
import { ReportType } from '../../lib/enums';
import { BillingReports } from './billing';
import { PerformanceReports } from './performance';
import { ReachReports } from './reach';
import { ExecutiveReports } from './executive';
import { CanAccess } from '@/components/auth';
import { RestrictedAccessKeys } from '@/lib/enums';

interface IReportingTabsContentProps {
  report: string;
}

export const ReportingTabsContent: FC<IReportingTabsContentProps> = ({
  report,
}) => {
  return (
    <>
      <PerformanceReports show={report === ReportType.Performance} />
      <CanAccess accessKey={RestrictedAccessKeys.BillingDashboard}>
        <BillingReports show={report === ReportType.Billing} />
      </CanAccess>
      <CanAccess accessKey={RestrictedAccessKeys.ReachDashboard}>
        <ReachReports show={report === ReportType.Reach} />
      </CanAccess>
      <CanAccess accessKey={RestrictedAccessKeys.ExecutiveDashboard}>
        <ExecutiveReports show={report === ReportType.Executive} />
      </CanAccess>
    </>
  );
};
