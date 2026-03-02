import { BarChartLoader } from '@/components/shared/loader/charts';
import { FC, useEffect, useState } from 'react';
import {
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { NoData } from '@/components/shared';
import { DzTooltip } from '../dz-tooltip';

import './dz-funnel-chart.scss';
import { DZONE_CLR_BLACK } from '@/lib/constants';

const AdditionalPercentage = 0.01;

interface IFunnelData {
  value: number;
  status?: string;
  name: string;
  percent: string;
  validValue?: number;
}

interface IDzFunnelChartProps {
  data: IFunnelData[];
  loaded?: boolean;
}

const yAxisLabelCharacters = 15;

export const DzFunnelChart: FC<IDzFunnelChartProps> = ({ data, loaded }) => {
  const [funnelData, setFunnelData] = useState<IFunnelData[]>([]);

  useEffect(() => {
    if (data.length && data[0].value !== 0) {
      const additionalValue = Math.ceil(data[0].value * AdditionalPercentage);
      setFunnelData(
        data.map((item) => ({
          ...item,
          validValue: item.value + additionalValue,
        })),
      );
    } else {
      setFunnelData([]);
    }
  }, [data]);

  if (!loaded) return <BarChartLoader />;

  if (loaded && funnelData.length === 0) return <NoData />;

  const renderLabel = (props: any) => {
    const { y, height, name } = props;
    return (
      <text
        x={0}
        y={y + height / 2}
        fill='black'
        textAnchor='start'
        dominantBaseline='central'
        fontSize={'0.75rem'}
        fontWeight={400}
        height={height}
        width={100}>
        {name.length > yAxisLabelCharacters
          ? `${name.slice(0, yAxisLabelCharacters)}...`
          : name}
      </text>
    );
  };

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <FunnelChart>
        <Tooltip
          content={({ active, payload }) => (
            <DzTooltip chartType='funnel' active={active} payload={payload} />
          )}
        />
        <Funnel
          shape={<Rectangle fill='#5D88FF' radius={4} />}
          activeShape={<Rectangle fill={DZONE_CLR_BLACK} radius={4} />}
          fill={DZONE_CLR_BLACK}
          dataKey='validValue'
          radius={4}
          style={{ cursor: 'pointer' }}
          data={funnelData}
          width={'70%'}
          isAnimationActive
          legendType='circle'>
          <LabelList
            position='middle'
            fill='#FFF'
            stroke='none'
            dataKey='value'
            fontSize={'0.75rem'}
            fontWeight={400}
          />
          <LabelList
            content={renderLabel}
            position='left'
            fill='#000'
            stroke='none'
            dataKey='name'
            fontSize={'0.75rem'}
            fontWeight={400}
            offset={10}
          />
          <Legend />
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
};
