import { ReachReportType } from '@/app/(dashboard)/dashboard/lib/enums';
import { useFetchReportData } from '@/app/(dashboard)/dashboard/lib/hooks';
import { IBaseReportRow } from '@/app/(dashboard)/dashboard/lib/types';
import { DzBarChart } from '@/components/charts/bar';
import { FC } from 'react';
import { ChartColumn } from '../../chart-column';

interface ILeadsByCountryProps {}

export const LeadsByCountry: FC<ILeadsByCountryProps> = ({}) => {
  const [chartData, isLoaded] = useFetchReportData<IBaseReportRow>(
    [],
    ReachReportType.LeadsByCountry,
  );
  return (
    <ChartColumn
      chartTitle='pages.dashboard.label.leadsByCountry'
      extraTitle={'pages.dashboard.label.count'}
      hasExtra
    >
      <DzBarChart data={chartData as IBaseReportRow[]} loaded={isLoaded} />
    </ChartColumn>
  );
};
