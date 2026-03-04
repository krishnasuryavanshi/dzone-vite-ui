import React from 'react';
import { WidgetConfig } from '../../lib/types';
import { PieChartWidget } from './pie-chart-widget';
import { BarChartWidget } from './bar-chart-widget';
import { TableWidget } from './table-widget';
import { StatCardWidget } from './stat-card-widget';

interface WidgetRendererProps {
  config: WidgetConfig;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ config }) => {
  switch (config.widgetType) {
    case 'pie-chart':
      return <PieChartWidget config={config} />;
    case 'bar-chart':
      return <BarChartWidget config={config} />;
    case 'table':
      return <TableWidget config={config} />;
    case 'stat-card':
      return <StatCardWidget config={config} />;
    default:
      return <div>Unknown widget type</div>;
  }
};
