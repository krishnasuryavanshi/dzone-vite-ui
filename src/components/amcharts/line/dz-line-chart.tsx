
import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

export type DZLineSeriesConfig = {
  id: string;
  name?: string;
  field: string;
  color?: string;
  strokeWidth?: number;
  dash?: number[];
  showBullets?: boolean;
  connect?: boolean;
};

export type DZLineAmChartProps = {
  data: Array<Record<string, any>>;
  series: DZLineSeriesConfig[];
  categoryKey?: string;
  title?: string | null;
  showLegend?: boolean;
  height?: string | number;
  width?: string | number;
  xLabelRotation?: number;
  xIsDate?: boolean;
};

export default function DZLineAmChart({
  data,
  series,
  categoryKey = 'category',
  title = null,
  showLegend = true,
  height = '100%',
  width = '100%',
  xLabelRotation = 0,
  xIsDate = false,
}: DZLineAmChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<any>(null);
  const chartRef = useRef<any>(null);
  const seriesRefs = useRef<Record<string, any>>({});

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const root = am5.Root.new(containerRef.current);
    rootRef.current = root;
    // Disable amCharts logo (works with subscription)
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
      }),
    );
    chartRef.current = chart;

    // Title
    if (title) {
      chart.children.unshift(
        am5.Label.new(root, {
          text: title,
          fontSize: 18,
          fontWeight: '700',
          x: am5.p50,
          centerX: am5.p50,
          paddingBottom: 12,
        }),
      );
    }

    // X axis
    let xAxis: any;
    if (xIsDate) {
      xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(root, {
          maxDeviation: 0.2,
          baseInterval: { timeUnit: 'day', count: 1 },
          renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
        }),
      );
    } else {
      xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: categoryKey,
          renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
        }),
      );
      if (xLabelRotation) {
        (xAxis.get('renderer') as any).labels.template.setAll({
          rotation: xLabelRotation,
          centerY: am5.p50,
        });
      }
    }

    // Y axis
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      }),
    );

    seriesRefs.current = {};
    for (const s of series) {
      const lineSeries = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: s.name ?? s.id,
          xAxis,
          yAxis,
          valueYField: s.field,
          categoryXField: categoryKey,
          tooltip: am5.Tooltip.new(root, {
            labelText: '{name}: {valueY}',
          }),
          connect: s.connect ?? true,
        }),
      );

      // stroke & styling
      if (s.color) {
        lineSeries.strokes.template.setAll({
          stroke: am5.color(s.color),
        });
        lineSeries.set('stroke', am5.color(s.color));
      }
      lineSeries.strokes.template.setAll({
        strokeWidth: s.strokeWidth ?? 2,
      });
      if (s.dash) {
        lineSeries.strokes.template.set('strokeDasharray', s.dash);
      }

      // Bullets
      if (s.showBullets) {
        lineSeries.bullets.push(() =>
          am5.Bullet.new(root, {
            sprite: am5.Circle.new(root, {
              radius: 4,
              stroke: am5.color('#ffffff'),
              strokeWidth: 1,
              fill: lineSeries.get('stroke'),
            }),
          }),
        );
      }

      // store ref
      seriesRefs.current[s.id] = lineSeries;
    }

    // Legend
    if (showLegend) {
      const legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50,
          marginTop: 10,
        }),
      );
      legend.data.setAll(chart.series.values);
    }

    // Set initial data
    if (xIsDate) {
    } else {
      xAxis.data.setAll(data);
    }

    // set data on each series
    for (const s of series) {
      const ss = seriesRefs.current[s.id];
      if (ss) {
        ss.data.setAll(data);
      }
    }

    chart.appear(800, 100);

    return () => {
      try {
        root.dispose();
      } catch (e) {}
      rootRef.current = null;
      chartRef.current = null;
      seriesRefs.current = {};
    };
  }, [
    JSON.stringify(
      series.map((s) => ({
        id: s.id,
        field: s.field,
        color: s.color,
        strokeWidth: s.strokeWidth,
        showBullets: s.showBullets,
        dash: s.dash,
        connect: s.connect,
      })),
    ),
    categoryKey,
    xIsDate,
    title,
    showLegend,
    xLabelRotation,
  ]);

  useLayoutEffect(() => {
    if (!chartRef.current) return;
    const chart = chartRef.current;
    const xIsDateLocal = xIsDate;
    if (!xIsDateLocal) {
      // category axis uses xAxis.data
      const xAxis = chart.xAxes.getIndex(0);
      if (xAxis) {
        xAxis.data.setAll(data);
      }
    }
    // update each series' data
    for (const s of series) {
      const ss = seriesRefs.current[s.id];
      if (ss) {
        ss.data.setAll(data);
      }
    }
  }, [data, series, xIsDate]);

  return <div ref={containerRef} style={{ width, height }} />;
}
