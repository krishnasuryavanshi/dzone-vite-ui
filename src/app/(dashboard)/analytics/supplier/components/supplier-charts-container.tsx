import { Row } from '@/uicomponents/layout/grid';
import { FC } from 'react';
import { ChartColumn } from './charts/supplier-chart-column';
import DZPieAmChart from '@/components/amcharts/pie/dz-pie-chart';
import { ResponsiveContainer } from 'recharts';
import DZBarAmChart from '@/components/amcharts/bar/dz-bar-chart';
import {
  FilterState,
  useFilterDashboardStore,
} from '@/app/(dashboard)/analytics/store/filter-dashboard-store/use-filter-dashboard-store';

interface ISupplierChartsContainerProps {}

export const ChartsContainer: FC<ISupplierChartsContainerProps> = ({}) => {
  const COLORS = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#d88484',
    '#8dcaff',
    '#a28dd8',
  ];
  const supplierBarData = useFilterDashboardStore(
    (state: FilterState) => state.supplierBarData,
  );
  const topReason = useFilterDashboardStore(
    (state: FilterState) => state.topReason,
  );
  const supplierPieData = useFilterDashboardStore(
    (state: FilterState) => state.supplierPieData,
  );

  const total = supplierBarData?.reduce(
    (acc: any, entry: any) => acc + entry.value,
    0,
  );

  return (
    <Row gutter={[16, 16]}>
      <ChartColumn chartTitle='pages.analytics.label.leadValidationQualityChartTitle'>
        <DZPieAmChart
          data={supplierPieData}
          categoryKey='leadState'
          valueKey='value'
          showLegend={true}
          colors={COLORS}
          tooltipText={topReason}
          onResolveTooltip={(datum, category, topReason) => {
            if (category === 'Invalid') {
              return 'Top Invalid Reasons:\n' + topReason?.join('\n');
            }
            return `${category}: ${datum.value}`;
          }}
        />
      </ChartColumn>
      <ChartColumn chartTitle='pages.analytics.label.returnReasonsChartTitle'>
        <ResponsiveContainer width='100%' height={280}>
          <DZBarAmChart
            data={supplierBarData}
            categoryKey='returnReason'
            valueKey='value'
            orientation='horizontal'
            xLabel='Count of Returned Leads'
            yLabel='Return Reasons'
            barColor='#8884d8'
          />
        </ResponsiveContainer>
      </ChartColumn>
    </Row>
  );
};
