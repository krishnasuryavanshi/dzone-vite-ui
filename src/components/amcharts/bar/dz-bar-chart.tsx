import { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

type Orientation = 'horizontal' | 'vertical';

export type BarDatum = Record<string, any>;

export type DZBarAmChartProps = {
  data: BarDatum[];
  categoryKey?: string;
  valueKey?: string;
  xLabel?: string;
  yLabel?: string;
  orientation?: Orientation;
  width?: string | number;
  height?: string | number;
  numberFormat?: string;
  barColor?: string;
};

export default function DZBarAmChart({
  data,
  categoryKey = 'category',
  valueKey = 'value',
  xLabel,
  yLabel,
  orientation = 'horizontal',
  width = '100%',
  height = '100%',
  numberFormat = '#,###',
  barColor = '#6687f8',
}: DZBarAmChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    // Root
    const root = am5.Root.new(chartRef.current);
    // Disable amCharts logo (works with subscription)
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);
    root.numberFormatter.set('numberFormat', numberFormat);

    // Chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
      }),
    );

    const isHorizontal = orientation === 'horizontal';

    // Value axis
    const valueAxis = (isHorizontal ? chart.xAxes : chart.yAxes).push(
      am5xy.ValueAxis.new(root, {
        renderer: isHorizontal
          ? am5xy.AxisRendererX.new(root, {})
          : am5xy.AxisRendererY.new(root, {}),
        min: 0,
        strictMinMax: false,
        maxPrecision: 0,
        numberFormat: '#',
      }),
    );

    // Category axis
    const categoryAxis = (isHorizontal ? chart.yAxes : chart.xAxes).push(
      am5xy.CategoryAxis.new(root, {
        categoryField: categoryKey,
        renderer: (isHorizontal ? am5xy.AxisRendererY : am5xy.AxisRendererX).new(root, {
          inversed: isHorizontal, // horizontal bar lists from top to bottom
          cellStartLocation: 0.02,
          cellEndLocation: 0.98,
          minGridDistance: 1, // Minimal space between grid lines
        }),
      }),
    );

    // Set very compact font size for category labels
    categoryAxis.get('renderer').labels.template.setAll({
      fontSize: 12,
      oversizedBehavior: 'truncate',
      fontWeight: '500',
      // maxWidth: 120,
      textAlign: 'right',
    });

    // Force category axis to show all categories with minimal spacing
    categoryAxis.get('renderer').set('minGridDistance', 1);

    // Set compact font size for value labels
    valueAxis.get('renderer').labels.template.setAll({
      fontSize: 12,
      fontWeight: '500',
    });

    // Axis labels
    const resolvedXLabel = xLabel ?? (isHorizontal ? 'Values' : 'Categories');
    const resolvedYLabel = yLabel ?? (isHorizontal ? '' : 'Values');

    // X label (bottom)
    (isHorizontal ? valueAxis : categoryAxis).children.push(
      am5.Label.new(root, {
        text: resolvedXLabel,
        x: am5.p50,
        centerX: am5.p50,
        paddingTop: 5,
        fontSize: 11,
        fontWeight: '500',
      }),
    );

    // Y label (left) - hide for horizontal charts to save space
    if (!isHorizontal && resolvedYLabel) {
      (isHorizontal ? categoryAxis : valueAxis).children.unshift(
        am5.Label.new(root, {
          text: resolvedYLabel,
          rotation: -90,
          y: am5.p50,
          centerY: am5.p50,
          centerX: am5.p50,
          paddingRight: 10,
          fontSize: 11,
          fontWeight: '500',
          width: 120,
        }),
      );
    }

    // Series
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Series',
        xAxis: isHorizontal ? (valueAxis as any) : (categoryAxis as any),
        yAxis: isHorizontal ? (categoryAxis as any) : (valueAxis as any),
        valueXField: isHorizontal ? (valueKey as string) : undefined,
        categoryYField: isHorizontal ? (categoryKey as string) : undefined,
        valueYField: !isHorizontal ? (valueKey as string) : undefined,
        categoryXField: !isHorizontal ? (categoryKey as string) : undefined,
        tooltip: am5.Tooltip.new(root, {
          labelText: isHorizontal
            ? `{${categoryKey}}: {${valueKey}}`
            : `{${categoryKey}}: {${valueKey}}`,
        }),
      }),
    );

    if (barColor) {
      series.columns.template.setAll({
        fill: am5.color(barColor),
        stroke: am5.color(barColor),
      });
    }

    // Rounded bar corners (auto-adjust by orientation)
    series.columns.template.setAll(
      isHorizontal
        ? { cornerRadiusTR: 4, cornerRadiusBR: 4 }
        : { cornerRadiusTL: 4, cornerRadiusTR: 4 },
    );

    if (!data || data.length === 0) {
      // Add centered "No Data" label
      root.container.children.push(
        am5.Label.new(root, {
          text: 'No Data',
          fontSize: 18,
          fontWeight: '500',
          fill: am5.color(0x999999),
          x: am5.p50,
          y: am5.p50,
          centerX: am5.p50,
          centerY: am5.p50,
        }),
      );
      // Hide axis labels and grids properly
      valueAxis.get('renderer').labels.template.setAll({ visible: false });
      valueAxis.get('renderer').grid.template.setAll({ visible: false });
      categoryAxis.get('renderer').labels.template.setAll({ visible: false });
      categoryAxis.get('renderer').grid.template.setAll({ visible: false });

      // Also hide tick marks
      valueAxis.get('renderer').ticks.template.setAll({ visible: false });
      categoryAxis.get('renderer').ticks.template.setAll({ visible: false });
    } else {
      // Initial data
      if (isHorizontal) {
        categoryAxis.data.setAll(data as any);
      } else {
        // vertical: category axis is X
        categoryAxis.data.setAll(data as any);
      }
      series.data.setAll(data as any);

      series.appear(1000);
      chart.appear(1000, 100);
    }

    return () => {
      root.dispose();
    };
  }, [orientation, xLabel, yLabel, categoryKey, valueKey, numberFormat, height, width]);

  return <div ref={chartRef} style={{ width, height }} />;
}
