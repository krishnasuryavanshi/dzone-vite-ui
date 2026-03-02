import { ReachReportType } from '@/app/(dashboard)/dashboard/lib/enums';
import { useFetchReportData } from '@/app/(dashboard)/dashboard/lib/hooks';
import { ILineReportRow } from '@/app/(dashboard)/dashboard/lib/types';
import { DzLineChart } from '@/components/charts/line';
import { FC } from 'react';
import { ChartColumn } from '../../chart-column';

interface IPacingProps {}

export const Pacing: FC<IPacingProps> = ({}) => {
  const [chartData, isLoaded] = useFetchReportData<ILineReportRow>(
    [],
    ReachReportType.Pacing
  );

  const lines = [
    { stroke: '#2CCFF3', dataKey: 'pacing' },
    { stroke: '#84E938', dataKey: 'released' },
    { stroke: '#F5D154', dataKey: 'reserved' },
  ];

  return (
    <ChartColumn chartTitle="pages.dashboard.label.pacing">
      <DzLineChart
        data={chartData as ILineReportRow[]}
        lines={lines}
        loaded={isLoaded}
      />
    </ChartColumn>
  );
};
