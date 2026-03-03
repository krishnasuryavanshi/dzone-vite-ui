
import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

interface DZAmSparklineProps {
  id: string;
  data: { value: number; date: number }[];
  color?: string;
  height?: string;
  width?: string;
}

const DZAmSparkline: React.FC<DZAmSparklineProps> = ({
  id,
  data,
  color = '#22c55e', // default color green
  height = '100%',
  width = '100%',
}) => {
  const chartRef = useRef<am5.Root | null>(null);

  useLayoutEffect(() => {
    const root = am5.Root.new(id);
    chartRef.current = root;

    root.setThemes([am5themes_Animated.new(root)]);

    // Chart container
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
      }),
    );

    // Hidden X axis
    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: 'day', count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0, // hides axis line
          minGridDistance: 30,
          visible: false,
        }),
      }),
    );

    xAxis.get('renderer').labels.template.set('visible', false);
    xAxis.get('renderer').grid.template.set('visible', false);
    xAxis.get('renderer').ticks.template.set('visible', false);

    // Hidden Y axis
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0, // hides axis line
          visible: false,
        }),
      }),
    );

    yAxis.get('renderer').labels.template.set('visible', false);
    yAxis.get('renderer').grid.template.set('visible', false);
    yAxis.get('renderer').ticks.template.set('visible', false);

    // Line series with area fill
    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        xAxis,
        yAxis,
        valueYField: 'value',
        valueXField: 'date',
        stroke: am5.color(color),
        fill: am5.color(color),
      }),
    );

    series.strokes.template.setAll({
      strokeWidth: 2,
    });

    // faded area under line
    series.fills.template.setAll({
      fillOpacity: 0.15,
      visible: true,
    });

    series.data.setAll(data);

    // Remove chart cursor
    chart.set('cursor', am5xy.XYCursor.new(root, { behavior: 'none' }));
    chart.get('cursor')?.lineX.set('visible', false);
    chart.get('cursor')?.lineY.set('visible', false);

    series.appear(500);
    chart.appear(500, 100);

    return () => {
      root.dispose();
    };
  }, [id, data, color]);

  return <div id={id} style={{ width, height }} />;
};

export default DZAmSparkline;
