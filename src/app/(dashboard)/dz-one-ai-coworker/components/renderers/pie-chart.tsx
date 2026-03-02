'use client';

import { FC } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { DzRecord } from '@/lib/types';

interface PieChartComponentProps {
  data: DzRecord[];
  xKey: string;
  yKey: string;
  colors: readonly string[];
  isAnimationActive: boolean;
}

export const PieChartComponent: FC<PieChartComponentProps> = ({
  data,
  xKey,
  yKey,
  colors,
  isAnimationActive,
}) => {
  return (
    <RechartsPieChart>
      <Pie
        data={data}
        dataKey={yKey}
        nameKey={xKey}
        cx='50%'
        cy='50%'
        outerRadius={80}
        label
        isAnimationActive={isAnimationActive}>
        {data.map((_, i) => (
          <Cell key={i} fill={colors[i % colors.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </RechartsPieChart>
  );
};
