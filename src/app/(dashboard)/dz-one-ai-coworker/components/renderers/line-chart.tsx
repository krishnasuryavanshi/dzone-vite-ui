'use client';

import { FC } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { DzRecord } from '@/lib/types';

interface LineChartComponentProps {
  data: DzRecord[];
  xKey: string;
  yKeys: string[];
  colors: readonly string[];
  isAnimationActive: boolean;
}

export const LineChartComponent: FC<LineChartComponentProps> = ({
  data,
  xKey,
  yKeys,
  colors,
  isAnimationActive,
}) => {
  return (
    <RechartsLineChart data={data}>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey={xKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      {yKeys.map((key, i) => (
        <Line
          key={key}
          type='monotone'
          dataKey={key}
          stroke={colors[i % colors.length]}
          isAnimationActive={isAnimationActive}
        />
      ))}
    </RechartsLineChart>
  );
};
