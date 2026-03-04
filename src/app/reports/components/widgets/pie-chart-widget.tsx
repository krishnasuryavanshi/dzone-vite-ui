import React from 'react';
import { Spin } from 'antd';
import DZPieAmChart from '@/components/amcharts/pie/dz-pie-chart';
import { PieChartWidgetConfig } from '../../lib/types';
import { useWidgetData } from '../../hooks';

interface PieChartWidgetProps {
  config: PieChartWidgetConfig;
}

export const PieChartWidget: React.FC<PieChartWidgetProps> = ({ config }) => {
  const { data, isLoading } = useWidgetData(config);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin />
      </div>
    );
  }

  return (
    <DZPieAmChart
      data={(data as Record<string, any>[]) ?? []}
      categoryKey={config.chart.categoryKey}
      valueKey={config.chart.valueKey}
      innerRadius={config.chart.innerRadius}
      showLegend={config.chart.showLegend}
      legendPosition={config.chart.legendPosition}
      colors={config.chart.colors}
      labelText={config.chart.labelText}
      height="100%"
      width="100%"
    />
  );
};
