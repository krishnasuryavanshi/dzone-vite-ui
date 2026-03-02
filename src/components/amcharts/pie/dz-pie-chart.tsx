'use client';

import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

export type PieDatum = Record<string, any>;

export type DZPieAmChartProps = {
  data: PieDatum[];
  categoryKey?: string;
  valueKey?: string;
  title?: string | null;
  innerRadius?: number | string;
  width?: string | number;
  height?: string | number;
  showLegend?: boolean;
  legendPosition?: 'right' | 'bottom' | 'top' | 'left';
  colors?: string[];
  tooltipText?: string;
  labelText?: string | null;
  numberFormat?: string;
  animate?: boolean;
  onSliceClick?: (datum: PieDatum) => void;
  onResolveTooltip?: (
    datum: PieDatum,
    categoryValue: any,
    customTooltip: any,
    series: any,
  ) => string | undefined;
};

export default function DZPieAmChart({
  data,
  categoryKey = 'category',
  valueKey = 'value',
  title = null,
  innerRadius = 0,
  width = '100%',
  height = '100%',
  showLegend = true,
  legendPosition = 'bottom',
  colors,
  tooltipText,
  labelText = "{category}\n{value} ({valuePercentTotal.formatNumber('#.0')}%)",
  numberFormat = '#,###',
  animate = true,
  onSliceClick,
  onResolveTooltip,
}: DZPieAmChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const legendRef = useRef<any>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // Dispose old chart root if it exists (important in React StrictMode)
    if (rootRef.current) {
      rootRef.current.dispose();
      rootRef.current = null;
    }

    const root = am5.Root.new(containerRef.current);
    rootRef.current = root;

    // Disable amCharts logo (works with subscription)
    root._logo?.dispose();

    root.setThemes([am5themes_Animated.new(root)]);
    if (numberFormat) {
      root.numberFormatter.set('numberFormat', numberFormat);
    }

    // Chart
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      }),
    );

    // Title
    if (title) {
      chart.children.unshift(
        am5.Label.new(root, {
          text: title,
          fontSize: 18,
          fontWeight: '700',
          textAlign: 'center',
          x: am5.p50,
          centerX: am5.p50,
          paddingBottom: 12,
        }),
      );
    }

    // Series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: valueKey,
        categoryField: categoryKey,
      }),
    );
    seriesRef.current = series;

    // Inner radius (donut)
    if (innerRadius !== 0) {
      if (typeof innerRadius === 'string' && innerRadius.trim().endsWith('%')) {
        const pct = parseFloat(innerRadius as string);
        if (!Number.isNaN(pct)) {
          chart.set('innerRadius', am5.percent(pct));
        }
      } else if (typeof innerRadius === 'number') {
        chart.set('innerRadius', innerRadius);
      }
    }

    if (colors && colors.length > 0) {
      series.get('colors')?.set(
        'colors',
        colors.map((c) => am5.color(c)),
      );
    }

    // Labels / ticks
    if (labelText === null) {
      series.labels.template.set('visible', false);
      series.ticks.template.set('visible', false);
    } else {
      series.labels.template.setAll({
        text: labelText,
        radius: 10,
        fill: am5.color(0x000000),
        inside: true,
        fontSize: 12,
        fontWeight: '500',
      });
    }

    // Tooltip
    series.slices.template.adapters.add('tooltipText', (text, target) => {
      const dataItem = target.dataItem;
      if (!dataItem) return text;

      const ctx = dataItem.dataContext as Record<string, any> | undefined;
      const catField = series.get('categoryField') as string | undefined;
      const valField = series.get('valueField') as string | undefined;

      const categoryValue = catField && ctx ? ctx[catField] : undefined;
      const value = valField && ctx ? ctx[valField] : undefined;

      if (onResolveTooltip) {
        const resolved = onResolveTooltip(
          ctx ?? {},
          categoryValue,
          tooltipText,
          series,
        );
        if (resolved !== undefined) return resolved;
      }

      return `${categoryValue ?? ''}: ${value ?? ''}`;
    });

    // Click handler
    if (onSliceClick) {
      series.slices.template.events.on('click', (ev: any) => {
        const datum = ev.target.dataItem?.dataContext;
        if (datum) onSliceClick(datum);
      });
    }

    if (!root || !series || series.isDisposed()) return;

    if (!data || data?.length === 0) {
      // Show "No Data" label in the center of the chart container
      let noDataLabel = root.container.children.push(
        am5.Label.new(root, {
          text: 'No data',
          x: am5.percent(50),
          y: am5.percent(50),
          centerX: am5.percent(50),
          centerY: am5.percent(50),
          fontSize: 16,
          fill: am5.color(0x999999),
        }),
      );
      series?.data?.setAll([]);
    } else {
      series?.data?.setAll(data as any);
    }

    // Legend
    if (showLegend) {
      const legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50,
          layout: root.horizontalLayout,
        }),
      );

      if (legendPosition === 'right') {
        legend.setAll({ centerY: am5.p50, y: am5.p50 });
        legend.itemContainers.template.setAll({ layout: root.verticalLayout });
      } else if (legendPosition === 'bottom') {
        legend.setAll({ centerX: am5.p50, x: am5.p50 });
      }

      legend.valueLabels.template.setAll({ text: '', visible: false });

      legend.labels.template.adapters.add('text', (_text, target) => {
        try {
          const di: any = (target as any).dataItem;
          const ctx: Record<string, any> | undefined = di?.dataContext;
          if (!ctx) return String(_text ?? '');
          const catField =
            (series.get('categoryField') as string) || categoryKey;
          return (ctx[catField] ?? '') as string;
        } catch (err) {
          return String(_text ?? '');
        }
      });
      // optional: style the marker
      legend.markers.template.setAll({ width: 12, height: 12 });

      if (legend && !legend.isDisposed()) {
        legend?.data?.setAll(series.dataItems);
      }
      legendRef.current = legend;
    }

    if (animate) {
      series.appear(800, 100);
    }

    return () => {
      try {
        root.dispose();
      } catch (e) {
        // swallow any dispose errors in cleanup
        // (dispose may throw if root was already disposed)
      }
      if (rootRef.current) {
        rootRef.current.dispose();
        rootRef.current = null;
      }
      seriesRef.current = null;
      legendRef.current = null;
    };
  }, [
    categoryKey,
    valueKey,
    innerRadius,
    colors,
    title,
    labelText,
    tooltipText,
    showLegend,
    legendPosition,
    numberFormat,
    animate,
  ]);

  // Update data reactively (no full rebuild)
  useLayoutEffect(() => {
    const series = seriesRef.current;
    const legend = legendRef.current;

    if (!series || series.isDisposed()) return;

    if (!data || data.length === 0) {
      // clear chart data
      series.data.setAll([]);
      if (legend && !legend.isDisposed()) {
        legend.data.setAll([]);
      }
    } else {
      // update with new data
      series.data.setAll(data as any);
      if (legend && !legend.isDisposed()) {
        legend.data.setAll(series.dataItems);
      }
    }
  }, [data]);

  return <div ref={containerRef} style={{ width, height }} />;
}
