import { BillingReportType } from '@/app/(dashboard)/dashboard/lib/enums';
import { useFetchReportData } from '@/app/(dashboard)/dashboard/lib/hooks';
import { IReportRow } from '@/app/(dashboard)/dashboard/lib/types';
import { DzPieChart } from '@/components/charts/pie';
import { FC } from 'react';
import { ChartColumn } from '../../chart-column';

interface INoOfBillableLeadsProps {}

export const NoOfBillableLeads: FC<INoOfBillableLeadsProps> = ({}) => {
  const [chartData, isLoaded] = useFetchReportData<IReportRow>(
    [],
    BillingReportType.NoOfBillableLeads,
  );
  return (
    <ChartColumn chartTitle='pages.dashboard.label.noOfBillableLeads'>
      <DzPieChart data={chartData as IReportRow[]} legendPlacement='left' loaded={isLoaded} />
    </ChartColumn>
  );
};
