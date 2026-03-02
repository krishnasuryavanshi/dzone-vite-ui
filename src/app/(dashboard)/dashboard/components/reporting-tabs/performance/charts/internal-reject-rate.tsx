import { PerformanceReportType } from '@/app/(dashboard)/dashboard/lib/enums';
import { useFetchReportData } from '@/app/(dashboard)/dashboard/lib/hooks';
import { IReportRow } from '@/app/(dashboard)/dashboard/lib/types';
import { DzPieChart } from '@/components/charts/pie';
import { FC } from 'react';
import { ChartColumn } from '../../chart-column';

interface IInternalRejectRateProps {}

export const InternalRejectRate: FC<IInternalRejectRateProps> = ({}) => {
  const [chartData, isLoaded] = useFetchReportData<IReportRow>(
    [],
    PerformanceReportType.InternalRejectRate
  );
  return (
    <ChartColumn chartTitle="pages.dashboard.label.internalRejectRate">
      <DzPieChart
        data={chartData as IReportRow[]}
        loaded={isLoaded}
      />
    </ChartColumn>
  );
};
