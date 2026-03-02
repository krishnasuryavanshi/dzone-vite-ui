'use client';

import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

export type DZGanttItem = {
  id?: string | number;
  task: string;
  start: string | number | Date;
  end: string | number | Date;
  color?: string;
  label?: string;
  group?: string;
};

export type DZGanttAmChartProps = {
  data: DZGanttItem[];
  title?: string;
  baseInterval?: {
    timeUnit: 'day' | 'week' | 'month' | 'hour' | 'minute' | 'second';
    count: number;
  };
  height?: string | number;
  width?: string | number;
  showScrollbar?: boolean;
  showCursor?: boolean;
  barHeight?: number;
  cornerRadius?: number;
  fillOpacity?: number;
  onBarClick?: (item: DZGanttItem, dataItem?: any) => void;
};

export default function DZGanttAmChart({
  data,
  title,
  baseInterval = { timeUnit: 'day', count: 1 },
  height = '100%',
  width = '100%',
  showScrollbar = false,
  showCursor = true,
  barHeight = 0.85,
  cornerRadius = 6,
  fillOpacity = 0.9,
  onBarClick,
}: DZGanttAmChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const yAxisRef = useRef<any>(null);

  const toMs = (v: string | number | Date) => {
    if (typeof v === 'number') return v;
    if (v instanceof Date) return v.getTime();
    const parsed = Date.parse(String(v));
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // clear to avoid multiple roots in dev/StrictMode
    containerRef.current.innerHTML = '';

    const root = am5.Root.new(containerRef.current);
    rootRef.current = root;
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
      }),
    );

    if (title) {
      chart.children.unshift(
        am5.Label.new(root, {
          text: title,
          fontSize: 18,
          fontWeight: '600',
          x: am5.p50,
          centerX: am5.p50,
          paddingBottom: 12,
        }),
      );
    }

    // Y Axis (categories/tasks)
    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'task',
        renderer: am5xy.AxisRendererY.new(root, { inversed: true }),
      }),
    );
    yAxisRef.current = yAxis;

    // X Axis (date)
    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: baseInterval,
        renderer: am5xy.AxisRendererX.new(root, {}),
      }),
    );

    // Column series which renders start->end bars horizontally
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        xAxis,
        yAxis,
        openValueXField: 'startMs',
        valueXField: 'endMs',
        categoryYField: 'task',
        tooltip: am5.Tooltip.new(root, {
          labelText: '{task}\n{startLabel} — {endLabel}',
        }),
      }),
    );

    series.columns.template.setAll({
      height: am5.percent(Math.max(1, Math.min(100, barHeight * 100))),
      strokeOpacity: 0,
      fillOpacity,
      cornerRadiusTL: cornerRadius,
      cornerRadiusTR: cornerRadius,
    });

    series.columns.template.adapters.add('fill', (fill, target) => {
      const ctx = target.dataItem?.dataContext as DZGanttItem;
      return ctx?.color ? am5.color(ctx.color) : fill;
    });

    series.columns.template.adapters.add('stroke', (stroke, target) => {
      const ctx = target.dataItem?.dataContext as DZGanttItem;
      return ctx?.color ? am5.color(ctx.color) : stroke;
    });

    // Cursor
    if (showCursor) {
      const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
    }

    // Scrollbars
    if (showScrollbar) {
      chart.set(
        'scrollbarX',
        am5.Scrollbar.new(root, { orientation: 'horizontal' }),
      );
      chart.set(
        'scrollbarY',
        am5.Scrollbar.new(root, { orientation: 'vertical' }),
      );
    }

    const processed = data.map((d) => {
      const startMs = toMs(d.start);
      const endMs = toMs(d.end);
      return {
        ...d,
        startMs,
        endMs,
        startLabel: new Date(startMs).toLocaleDateString(),
        endLabel: new Date(endMs).toLocaleDateString(),
        color: d.color ? am5.color(d.color) : undefined,
      };
    });

    // set categories & series data
    yAxis.data.setAll(processed.map((p) => ({ task: p.task })));
    series.data.setAll(processed as any);

    // click handler
    series.columns.template.events.on('click', (ev: any) => {
      const ctx = ev.target.dataItem?.dataContext;
      if (onBarClick && ctx) onBarClick(ctx as DZGanttItem, ev.target.dataItem);
    });

    series.appear(800);
    chart.appear(800, 100);

    seriesRef.current = series;

    return () => {
      try {
        root.dispose();
      } catch (e) {
        // ignore
      }
      rootRef.current = null;
      seriesRef.current = null;
      yAxisRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    if (!rootRef.current || !seriesRef.current || !yAxisRef.current) return;

    const root = rootRef.current;
    const processed = data.map((d) => {
      const startMs = toMs(d.start);
      const endMs = toMs(d.end);
      return {
        ...d,
        startMs,
        endMs,
        startLabel: new Date(startMs).toLocaleDateString(),
        endLabel: new Date(endMs).toLocaleDateString(),
        color: d.color ? am5.color(d.color) : undefined,
      };
    });

    yAxisRef.current.data.setAll(processed.map((p) => ({ task: p.task })));
    seriesRef.current.data.setAll(processed as any);
  }, [data]);

  const styleWidth = typeof width === 'number' ? `${width}px` : width;
  const styleHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      ref={containerRef}
      style={{ width: styleWidth, height: styleHeight }}
    />
  );
}
