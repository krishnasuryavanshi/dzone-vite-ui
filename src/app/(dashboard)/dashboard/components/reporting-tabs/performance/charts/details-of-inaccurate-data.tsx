import { PerformanceReportType } from '@/app/(dashboard)/dashboard/lib/enums';
import { useFetchReportData } from '@/app/(dashboard)/dashboard/lib/hooks';
import { IBaseReportRow } from '@/app/(dashboard)/dashboard/lib/types';
import { DzBarChart } from '@/components/charts/bar';
import { FC } from 'react';
import { ChartColumn } from '../../chart-column';

interface IDetailsOfInaccurateDataProps {}

export const DetailsOfInaccurateData: FC<IDetailsOfInaccurateDataProps> = ({}) => {
  const [chartData, isLoaded] = useFetchReportData<IBaseReportRow>(
    [],
    PerformanceReportType.DetailsOfInaccurateData,
  );
  return (
    <ChartColumn
      chartTitle='pages.dashboard.label.detailsOfInaccurateData'
      extraTitle='pages.dashboard.label.count'
      hasExtra
    >
      <DzBarChart data={chartData as IBaseReportRow[]} loaded={isLoaded} />
    </ChartColumn>
  );
};
