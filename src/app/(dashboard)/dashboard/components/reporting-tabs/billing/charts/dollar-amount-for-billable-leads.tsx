import { BillingReportType } from '@/app/(dashboard)/dashboard/lib/enums';
import { useFetchReportData } from '@/app/(dashboard)/dashboard/lib/hooks';
import { IReportRow } from '@/app/(dashboard)/dashboard/lib/types';
import { DzPieChart } from '@/components/charts/pie';
import { FC } from 'react';
import { ChartColumn } from '../../chart-column';

interface IDollarAmountForBillableLeadsProps {}

export const DollarAmountForBillableLeads: FC<
  IDollarAmountForBillableLeadsProps
> = ({}) => {
  const [chartData, isLoaded] = useFetchReportData<IReportRow>(
    [],
    BillingReportType.DollarAmountForBillableLeads
  );

  return (
    <ChartColumn chartTitle="pages.dashboard.label.dollarAmountForBilledLeads">
      <DzPieChart
        data={chartData as IReportRow[]}
        legendPlacement="left"
        prependDollarInLabel
        loaded={isLoaded}
      />
    </ChartColumn>
  );
};
