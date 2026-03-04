import React from 'react';
import { Spin } from 'antd';
import DZBarAmChart from '@/components/amcharts/bar/dz-bar-chart';
import { BarChartWidgetConfig } from '../../lib/types';
import { useWidgetData } from '../../hooks';

interface BarChartWidgetProps {
  config: BarChartWidgetConfig;
}

export const BarChartWidget: React.FC<BarChartWidgetProps> = ({ config }) => {
  const { data, isLoading } = useWidgetData(config);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin />
      </div>
    );
  }

  return (
    <DZBarAmChart
      data={(data as Record<string, any>[]) ?? []}
      categoryKey={config.chart.categoryKey}
      valueKey={config.chart.valueKey}
      orientation={config.chart.orientation}
      barColor={config.chart.barColor}
      xLabel={config.chart.xLabel}
      yLabel={config.chart.yLabel}
      height="100%"
      width="100%"
    />
  );
};
