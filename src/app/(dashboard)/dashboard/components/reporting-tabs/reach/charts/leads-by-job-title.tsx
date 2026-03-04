import { ReachReportType } from '@/app/(dashboard)/dashboard/lib/enums';
import { useFetchReportData } from '@/app/(dashboard)/dashboard/lib/hooks';
import { IBaseReportRow } from '@/app/(dashboard)/dashboard/lib/types';
import { DzBarChart } from '@/components/charts/bar';
import { FC } from 'react';
import { ChartColumn } from '../../chart-column';

interface ILeadsByJobTitleProps {}

export const LeadsByJobTitle: FC<ILeadsByJobTitleProps> = ({}) => {
  const [chartData, isLoaded] = useFetchReportData<IBaseReportRow>(
    [],
    ReachReportType.LeadsByJobTitle,
  );
  return (
    <ChartColumn
      chartTitle='pages.dashboard.label.leadsByJobTitle'
      extraTitle={'pages.dashboard.label.count'}
      hasExtra
    >
      <DzBarChart data={chartData as IBaseReportRow[]} loaded={isLoaded} />
    </ChartColumn>
  );
};
