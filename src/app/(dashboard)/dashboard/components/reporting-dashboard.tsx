'use client';

import { FC } from 'react';
import { DashboardReportContextProvider } from '../contexts';
import { ReportingDashboardContainer } from './reporting-dashboard-container';

interface IReportingDashboardProps {}

export const ReportingDashboard: FC<IReportingDashboardProps> = ({}) => {
  return (
    <DashboardReportContextProvider>
      <ReportingDashboardContainer />
    </DashboardReportContextProvider>
  );
};
