import { FC } from 'react';
import { ChartCard } from './charts/marketer-chart-card';
import { ResponsiveContainer } from 'recharts';
import DZBarAmChart from '@/components/amcharts/bar/dz-bar-chart';
import {
  FilterState,
  useFilterDashboardStore,
} from '@/app/(dashboard)/analytics/store/filter-dashboard-store/use-filter-dashboard-store';

interface IMarketerChartsContainerProps {}

export const ChartsContainer: FC<IMarketerChartsContainerProps> = ({}) => {
  const returnReasonData = useFilterDashboardStore((state: FilterState) => state.returnReasonData);

  return (
    <div className='dz-one-chart-card-container'>
      <ChartCard title='pages.analytics.label.returnReasonsChartTitle'>
        <ResponsiveContainer width='100%' height={280}>
          <DZBarAmChart
            data={returnReasonData}
            categoryKey='returnReason'
            valueKey='value'
            orientation='horizontal'
            xLabel='Count of Returned Leads'
            yLabel='Return Reasons'
            barColor='#8884d8'
          />
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};
