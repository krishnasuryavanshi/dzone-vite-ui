'use client';

import { FC } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { DzRecord } from '@/lib/types';

interface BarChartComponentProps {
  data: DzRecord[];
  xKey: string;
  yKeys: string[];
  colors: readonly string[];
  isAnimationActive: boolean;
}

export const BarChartComponent: FC<BarChartComponentProps> = ({
  data,
  xKey,
  yKeys,
  colors,
  isAnimationActive,
}) => {
  return (
    <RechartsBarChart data={data}>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey={xKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      {yKeys.map((key, i) => (
        <Bar
          key={key}
          dataKey={key}
          fill={colors[i % colors.length]}
          isAnimationActive={isAnimationActive}
        />
      ))}
    </RechartsBarChart>
  );
};
