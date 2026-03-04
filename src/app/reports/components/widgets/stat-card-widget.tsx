import React from 'react';
import { Spin, Statistic } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { StatCardWidgetConfig } from '../../lib/types';
import { useWidgetData } from '../../hooks';
import './stat-card-widget.scss';

interface StatCardWidgetProps {
  config: StatCardWidgetConfig;
}

export const StatCardWidget: React.FC<StatCardWidgetProps> = ({ config }) => {
  const { data, isLoading } = useWidgetData(config);

  if (isLoading) {
    return (
      <div className="stat-card-loading">
        <Spin />
      </div>
    );
  }

  const record = (data as Record<string, unknown>[])?.[0];
  if (!record) return null;

  const { stat } = config;
  const value = record[stat.valueKey] as number;
  const change = stat.changeKey ? (record[stat.changeKey] as number) : undefined;

  const formatValue = () => {
    const precision = stat.precision ?? (stat.format === 'percentage' ? 2 : 0);
    return stat.format === 'currency' || stat.format === 'percentage'
      ? value.toFixed(precision)
      : value.toLocaleString();
  };

  const getChangeClass = () => {
    if (change === undefined || change === 0) return 'neutral';
    const isPositive = change > 0;
    const isGood = stat.changeDirection === 'up-is-good';
    if (isPositive) return isGood ? 'positive-good' : 'positive-bad';
    return isGood ? 'negative-bad' : 'negative-good';
  };

  return (
    <div className="stat-card-content">
      <Statistic
        value={formatValue()}
        prefix={stat.prefix}
        suffix={stat.suffix}
      />
      {change !== undefined && (
        <div className={`stat-card-change ${getChangeClass()}`}>
          {change > 0 ? <CaretUpOutlined /> : change < 0 ? <CaretDownOutlined /> : null}
          <span>{Math.abs(change)}%</span>
          {stat.changeLabel && <span>{stat.changeLabel}</span>}
        </div>
      )}
    </div>
  );
};
