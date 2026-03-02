import { NoData } from '@/components/shared';
import { PieChartLoader } from '@/components/shared/loader/charts';
import { FC, useEffect, useState } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { DzLegend } from '../dz-legend';
import { DzTooltip } from '../dz-tooltip';
import { DzPieLabel } from './dz-pie-label';

import '../dz-chart.scss';

export interface IPieData {
  name: string;
  value: number;
  percent: string;
  color?: string;
  meta?: any;
}

interface IPieChartProps {
  data: IPieData[];
  legendPlacement?: 'bottom' | 'left';
  prependDollarInLabel?: boolean;
  loaded?: boolean;
}

const COLORS = ['#5D88FF', '#F9C74F', '#90BE6D', '#F3722C', '#DCBDEF'];

export const DzPieChart: FC<IPieChartProps> = ({
  data,
  legendPlacement = 'bottom',
  prependDollarInLabel = false,
  loaded,
}) => {
  const [pieData, setPieData] = useState<IPieData[]>([]);

  useEffect(() => {
    setPieData(
      data
        .filter(({ value }) => value > 0)
        .map((item, index) => ({ ...item, color: COLORS[index] }))
    );
  }, [data]);

  if (!loaded) return <PieChartLoader />;
  if (loaded && pieData.length === 0) return <NoData />;

  return (
    <ResponsiveContainer
      width="100%"
      height="100%">
      <PieChart
        className={`dz-pie-chart dz-chart legend-placement-${legendPlacement}`}>
        <Pie
          cursor="pointer"
          dataKey="value"
          isAnimationActive={true}
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(labelData: any) => (
            <DzPieLabel
              data={labelData}
              prependDollarInLabel={prependDollarInLabel}
            />
          )}
          outerRadius={110}>
          {pieData.map((entry) => (
            <Cell
              key={entry.name}
              fill={entry.color}
              stroke="none"
            />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => (
            <DzTooltip
              active={active}
              payload={payload}
              prependDollarInLabel={prependDollarInLabel}
            />
          )}
        />
        <Legend
          verticalAlign={legendPlacement === 'left' ? 'middle' : 'bottom'}
          align={legendPlacement === 'left' ? 'left' : 'center'}
          layout={legendPlacement === 'left' ? 'vertical' : 'horizontal'}
          content={({ payload }) => (
            <DzLegend
              payload={payload}
              placement={legendPlacement}
            />
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
