import { PerformanceReportType } from '@/app/(dashboard)/dashboard/lib/enums';
import { useFetchReportData } from '@/app/(dashboard)/dashboard/lib/hooks';
import { IBaseReportRow } from '@/app/(dashboard)/dashboard/lib/types';
import { DzBarChart } from '@/components/charts/bar';
import { FC } from 'react';
import { ChartColumn } from '../../chart-column';

interface IClientRejectionReasonsProps {}

export const ClientRejectionReasons: FC<
  IClientRejectionReasonsProps
> = ({}) => {
  const [chartData, isLoaded] = useFetchReportData<IBaseReportRow>(
    [],
    PerformanceReportType.ClientRejectionReasons
  );
  return (
    <ChartColumn
      chartTitle="pages.dashboard.label.clientRejectionReasons"
      extraTitle={'pages.dashboard.label.count'}
      hasExtra>
      <DzBarChart
        data={chartData as IBaseReportRow[]}
        loaded={isLoaded}
      />
    </ChartColumn>
  );
};
