import { PerformanceReportType } from '@/app/(dashboard)/dashboard/lib/enums';
import { useFetchReportData } from '@/app/(dashboard)/dashboard/lib/hooks';
import { IReportRowWithPercentage } from '@/app/(dashboard)/dashboard/lib/types';
import { DzFunnelChart } from '@/components/charts/funnel';
import { FC } from 'react';
import { ChartColumn } from '../../chart-column';

interface ILeadStatusProps {}

export const LeadStatus: FC<ILeadStatusProps> = ({}) => {
  const [chartData, isLoaded] = useFetchReportData<IReportRowWithPercentage>(
    [],
    PerformanceReportType.LeadStatus
  );

  return (
    <ChartColumn
      chartTitle="pages.dashboard.label.leadStatus"
      extraTitle={'pages.dashboard.label.statusAndCount'}
      hasExtra>
      <DzFunnelChart
        data={chartData as IReportRowWithPercentage[]}
        loaded={isLoaded}
      />
    </ChartColumn>
  );
};
