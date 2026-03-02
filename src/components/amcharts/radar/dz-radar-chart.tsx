'use client';

import React, { useLayoutEffect, useMemo, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5radar from '@amcharts/amcharts5/radar';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

export type DZGaugeBand = {
  start: number;
  end: number;
  color: string;
  label?: string;
  opacity?: number;
};

export interface DZRadarAmChartProps {
  value: number;
  min?: number;
  max?: number;
  startAngle?: number; // e.g. 180 for half-gauge
  endAngle?: number; // e.g. 360 for half-gauge
  innerRadius?: number | am5.Percent; // default: -40
  title?: string;
  units?: string;
  decimals?: number; // default 0
  bands?: DZGaugeBand[];
  hand?: {
    pinRadius?: number; // px or Percent; default 12
    radiusPercent?: number; // 0..100; default 90
    bottomWidth?: number; // default 10
    color?: string;
  };
  animate?: boolean; // default true
  animationDurationMs?: number; // default 600
  height?: number | string; // default '100%'
  width?: number | string; // default '100%'
  className?: string;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export const DZRadarAmChart: React.FC<DZRadarAmChartProps> = ({
  value,
  min = 0,
  max = 100,
  startAngle = 180,
  endAngle = 360,
  innerRadius = -40,
  title,
  units,
  decimals = 0,
  bands = [
    { start: 0, end: 40, color: '#22c55e', label: 'On pace' },
    { start: 40, end: 70, color: '#facc15', label: 'Slightly off' },
    { start: 70, end: 100, color: '#ef4444', label: 'Over/under' },
  ],
  hand = {},
  animate = true,
  animationDurationMs = 600,
  height = '100%',
  width = '100%',
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<am5.Root | null>(null);
  const chartRef = useRef<am5radar.RadarChart | null>(null);
  const xAxisRef = useRef<am5xy.ValueAxis<am5xy.AxisRenderer> | null>(null);
  const bandsRef = useRef<am5.DataItem<any>[]>([]);
  const axisDataItemRef = useRef<am5.DataItem<any> | null>(null);
  const handBulletRef = useRef<am5xy.AxisBullet | null>(null);
  const valueLabelRef = useRef<am5.Label | null>(null);

  const clamped = useMemo(() => clamp(value, min, max), [value, min, max]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // Ensure we don't mount twice (Fast Refresh)
    if (rootRef.current) {
      rootRef.current.dispose();
      rootRef.current = null;
    }

    const root = am5.Root.new(containerRef.current);
    rootRef.current = root;

    root.setThemes([am5themes_Animated.new(root)]);

    // Chart
    const chart = root.container.children.push(
      am5radar.RadarChart.new(root, {
        startAngle,
        endAngle,
        innerRadius,
      }),
    );
    chartRef.current = chart;

    // Optional Title
    if (title) {
      chart.children.unshift(
        am5.Label.new(root, {
          text: title,
          fontSize: 18,
          fontWeight: '600',
          x: am5.p50,
          centerX: am5.p50,
          paddingBottom: 10,
        }),
      );
    }

    // Axis
    const axisRenderer = am5radar.AxisRendererCircular.new(root, {
      innerRadius,
    });

    axisRenderer.grid.template.setAll({ visible: false });

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min,
        max,
        strictMinMax: true,
        renderer: axisRenderer,
      }),
    );
    xAxisRef.current = xAxis;

    // Bands (ranges)
    const addBand = (
      start: number,
      end: number,
      color: string,
      label?: string,
      opacity = 0.8,
    ) => {
      const di = xAxis.makeDataItem({ value: start, endValue: end });
      const range = xAxis.createAxisRange(di);

      const axisFill = di.get('axisFill');
      if (axisFill) {
        axisFill.setAll({
          visible: true,
          fill: am5.color(color),
          fillOpacity: opacity,
        });
      }

      if (label) {
        const labelItem = di.get('label');
        if (labelItem)
          labelItem.setAll({
            text: label,
            inside: true,
            fontSize: 12,
            fill: am5.color(0xffffff),
            centerX: am5.p50,
            centerY: am5.p50,
            dy: -10, // adjust vertical position
          });
      }

      bandsRef.current.push(range);
    };

    bands.forEach((b) =>
      addBand(b.start, b.end, b.color, b.label, b.opacity ?? 0.8),
    );

    // Hand (needle)
    const axisDataItem = xAxis.makeDataItem({ value: clamped });
    const clockHand = am5radar.ClockHand.new(root, {
      pinRadius: hand.pinRadius ?? 12,
      radius: am5.percent(hand.radiusPercent ?? 90),
      bottomWidth: hand.bottomWidth ?? 10,
    });

    const bullet = am5xy.AxisBullet.new(root, { sprite: clockHand });
    axisDataItem.set('bullet', bullet);
    xAxis.createAxisRange(axisDataItem);

    // Apply hand color (pin + hand)
    if (hand.color) {
      clockHand.pin.setAll({
        fill: am5.color(hand.color),
        stroke: am5.color(hand.color),
        fillOpacity: 0.9,
      });
      clockHand.hand.setAll({
        fill: am5.color(hand.color),
        stroke: am5.color(hand.color),
        fillOpacity: 0.9,
      });
    }

    axisDataItemRef.current = axisDataItem;
    handBulletRef.current = bullet;

    // Center readout
    const valueLabel = chart.radarContainer.children.push(
      am5.Label.new(root, {
        text: units
          ? `${clamped.toFixed(decimals)}${units}`
          : clamped.toFixed(decimals),
        centerX: am5.p50,
        centerY: am5.p50,
        fontSize: 15,
        fontWeight: '700',
      }),
    );
    valueLabelRef.current = valueLabel;

    chart.appear(800, 100);

    return () => {
      root.dispose();
    };
    // We intentionally mount only once; dynamic props handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width, height }}
      aria-label={title ?? 'Gauge chart'}
      role='img'
    />
  );
};

export default DZRadarAmChart;
