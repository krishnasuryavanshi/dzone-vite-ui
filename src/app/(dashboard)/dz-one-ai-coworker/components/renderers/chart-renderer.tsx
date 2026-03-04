import { FC, useMemo, useRef, useEffect } from 'react';
import { Spin } from '@/uicomponents';
import { Card } from '@/uicomponents/layout/card';
import { Text } from '@/uicomponents/text';
import { Flex } from '@/uicomponents/layout';
import { ResponsiveContainer } from 'recharts';
import { ChartData, ChartType } from '../../lib/types';
import { COLORS } from '../../lib/constants/colors';
import { BarChartComponent } from './bar-chart';
import { LineChartComponent } from './line-chart';
import { PieChartComponent } from './pie-chart';
import { Hideable } from '@/components/shared';

interface ChartRendererProps {
  data: string;
}

export const ChartRenderer: FC<ChartRendererProps> = ({ data }) => {
  const hasRenderedRef = useRef(false);
  const isAnimationActive = !hasRenderedRef.current;

  useEffect(() => {
    hasRenderedRef.current = true;
  }, []);

  const chartData = useMemo<ChartData | null>(() => {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }, [data]);

  const { type, title, chartItems, colors, xKey, yKeys } = useMemo(() => {
    if (!chartData) {
      return {
        type: null,
        title: null,
        chartItems: [],
        colors: COLORS.CHART,
        xKey: 'name',
        yKeys: [] as string[],
      };
    }
    const configColors = chartData.config?.colors || COLORS.CHART;
    const configXKey = chartData.config?.xKey || 'name';
    const configYKeys =
      chartData.config?.yKeys ||
      Object.keys(chartData.data[0] || {}).filter((k) => k !== configXKey);

    return {
      type: chartData.type,
      title: chartData.title,
      chartItems: chartData.data,
      colors: configColors,
      xKey: configXKey,
      yKeys: configYKeys,
    };
  }, [chartData]);

  const renderChart = useMemo(() => {
    if (!type) return null;

    switch (type) {
      case ChartType.BAR:
        return (
          <BarChartComponent
            data={chartItems}
            xKey={xKey}
            yKeys={yKeys}
            colors={colors}
            isAnimationActive={isAnimationActive}
          />
        );
      case ChartType.LINE:
        return (
          <LineChartComponent
            data={chartItems}
            xKey={xKey}
            yKeys={yKeys}
            colors={colors}
            isAnimationActive={isAnimationActive}
          />
        );
      case ChartType.PIE:
        return (
          <PieChartComponent
            data={chartItems}
            xKey={xKey}
            yKey={yKeys[0]}
            colors={colors}
            isAnimationActive={isAnimationActive}
          />
        );
      default:
        return <Text type='secondary'>Unsupported chart type: {type}</Text>;
    }
  }, [type, chartItems, xKey, yKeys, colors, isAnimationActive]);

  return (
    <Card size='small' style={{ margin: '0.5rem 0' }}>
      <Hideable show={!chartData}>
        <Flex align='center' gap='0.5rem' style={{ padding: '1rem 0' }}>
          <Spin size='small' />
          <Text type='secondary'>Processing chart data...</Text>
        </Flex>
      </Hideable>

      <Hideable show={!!chartData}>
        {title && (
          <Text strong style={{ display: 'block', marginBottom: '0.5rem' }}>
            {title}
          </Text>
        )}
        <ResponsiveContainer width='100%' height={300}>
          {renderChart || <></>}
        </ResponsiveContainer>
      </Hideable>
    </Card>
  );
};
