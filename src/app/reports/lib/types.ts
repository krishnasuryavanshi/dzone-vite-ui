// ─── Page Config ────────────────────────────────────────────
export interface ReportPageConfig {
  id: string;
  title: string;
  subtitle?: string;
  filters: FilterConfig[];
  widgets: WidgetConfig[];
}

// ─── Filters ────────────────────────────────────────────────
export type FilterConfig =
  | DateRangeFilterConfig
  | SingleSelectFilterConfig
  | MultiSelectFilterConfig
  | TextInputFilterConfig
  | NumberRangeFilterConfig;

interface BaseFilterConfig {
  id: string;
  label: string;
  dependsOn?: string[];
  mandatory?: boolean;
  defaultVisible?: boolean;
}

export interface DateRangeFilterConfig extends BaseFilterConfig {
  type: 'date-range';
  presets: DatePreset[];
  defaultPreset?: string;
}

export interface DatePreset {
  key: string;
  label: string;
  relativeValue?: { amount: number; unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years' };
}

export interface SingleSelectFilterConfig extends BaseFilterConfig {
  type: 'single-select';
  optionsEndpoint: string;
  placeholder?: string;
}

export interface MultiSelectFilterConfig extends BaseFilterConfig {
  type: 'multi-select';
  optionsEndpoint: string;
  placeholder?: string;
  searchable?: boolean;
  showCount?: boolean;
}

export interface TextInputFilterConfig extends BaseFilterConfig {
  type: 'text-input';
  placeholder?: string;
  debounceMs?: number;
}

export interface NumberRangeFilterConfig extends BaseFilterConfig {
  type: 'number-range';
  min?: number;
  max?: number;
  step?: number;
  placeholderMin?: string;
  placeholderMax?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export type DateFilterValue =
  | { type: 'preset'; presetKey: string }
  | { type: 'relative'; amount: number; unit: string }
  | { type: 'absolute'; from: string; to: string }
  | null;

// ─── Widgets ────────────────────────────────────────────────
export type WidgetConfig = PieChartWidgetConfig | BarChartWidgetConfig | TableWidgetConfig | StatCardWidgetConfig;

interface BaseWidgetConfig {
  id: string;
  title: string;
  dataEndpoint: string;
  layout: { colSpan: number; minHeight?: string };
  actions?: { type: 'notification' | 'ai' | 'more'; tooltip?: string }[];
}

export interface PieChartWidgetConfig extends BaseWidgetConfig {
  widgetType: 'pie-chart';
  chart: {
    categoryKey: string;
    valueKey: string;
    innerRadius?: number | string;
    showLegend?: boolean;
    legendPosition?: 'right' | 'bottom' | 'top' | 'left';
    colors?: string[];
    labelText?: string | null;
  };
}

export interface BarChartWidgetConfig extends BaseWidgetConfig {
  widgetType: 'bar-chart';
  chart: {
    categoryKey: string;
    valueKey: string;
    orientation?: 'horizontal' | 'vertical';
    barColor?: string;
    xLabel?: string;
    yLabel?: string;
  };
}

export interface TableWidgetConfig extends BaseWidgetConfig {
  widgetType: 'table';
  table: {
    columns: TableColumnConfig[];
    rowKey: string;
    pagination?: boolean;
    pageSize?: number;
  };
}

export interface StatCardWidgetConfig extends BaseWidgetConfig {
  widgetType: 'stat-card';
  stat: {
    valueKey: string;
    format?: 'number' | 'currency' | 'percentage';
    prefix?: string;
    suffix?: string;
    precision?: number;
    changeKey?: string;
    changeDirection?: 'up-is-good' | 'up-is-bad';
    changeLabel?: string;
  };
}

export interface TableColumnConfig {
  key: string;
  title: string;
  dataIndex: string;
  width?: number | string;
  sortable?: boolean;
  inlineBar?: { color?: string };
}
