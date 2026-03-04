import { Text } from '@/uicomponents/text';
import { CaretUpFilled, CaretDownFilled, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { PacingSummaryStatus } from '../../lib/types';
import { PacingStatusTag } from './pacing-status-tag';
import { Flex } from '@/uicomponents/layout';
import { getFilterableColumn } from '@/lib/utils/table/filterable-column';
import styles from './summary.module.css';

interface SortHandlers {
  sortOrder: 'ASC' | 'DESC' | null;
  onSort: () => void;
  statusFilter: string[];
  onStatusFilter: (values: string[]) => void;
}

const SortIcon = ({ sortOrder }: { sortOrder: 'ASC' | 'DESC' | null }) => {
  return (
    <Flex vertical style={{ lineHeight: 0, marginLeft: '0.25rem' }}>
      <CaretUpFilled
        className={`${styles.sortIcon} ${sortOrder === 'ASC' ? styles.sortIconActive : ''}`}
        style={{ fontSize: '0.5rem' }}
      />
      <CaretDownFilled
        className={`${styles.sortIcon} ${sortOrder === 'DESC' ? styles.sortIconActive : ''}`}
        style={{ fontSize: '0.5rem' }}
      />
    </Flex>
  );
};

const VarianceCell = ({ value }: { value: number }) => {
  let className = styles.varianceZero;
  let icon = null;
  let displayValue = value.toLocaleString();
  if (value > 0) {
    className = styles.variancePositive;
    icon = <RiseOutlined style={{ fontSize: '0.75rem' }} />;
    displayValue = `+${displayValue}`;
  } else if (value < 0) {
    className = styles.varianceNegative;
    icon = <FallOutlined style={{ fontSize: '0.75rem' }} />;
  }
  return (
    <Flex align='center' gap='0.375rem' className={className}>
      {displayValue}
      {icon}
    </Flex>
  );
};

const statusFilterConfig = getFilterableColumn({
  filters: Object.values(PacingSummaryStatus),
});

const COL_WIDTHS: Record<string, string> = {
  periodLabel: '15%',
  expected: '12%',
  published: '12%',
  variance: '13%',
  delivered: '12%',
  held: '10%',
  status: '16%',
  viewDetails: '10%',
};

const HIDDEN_KEYS = new Set([
  'id',
  'lineItemId',
  'periodType',
  'periodStartDate',
  'periodEndDate',
  'dailyBreakdown',
  'key',
]);

const getPeriodTitle = (pacingType: string, isChild?: boolean): string => {
  if (isChild) return 'Date';
  if (pacingType === 'Weekly') return 'Weeks';
  if (pacingType === 'Monthly') return 'Months';
  return 'Date';
};

const getColumnConfig = (
  pacingType: string,
  handlers: SortHandlers,
  isChild?: boolean,
): Record<string, any> => ({
  periodLabel: {
    title: (
      <Flex align='center' style={{ cursor: 'pointer' }} onClick={() => handlers.onSort()}>
        <Text strong>{getPeriodTitle(pacingType, isChild)}</Text>
        <SortIcon sortOrder={handlers.sortOrder} />
      </Flex>
    ),
    dataIndex: 'periodLabel',
    key: 'period',
    width: COL_WIDTHS.periodLabel,
  },
  expected: {
    title: 'Expected',
    dataIndex: 'expected',
    key: 'expected',
    width: COL_WIDTHS.expected,
    render: (value: number) => value?.toLocaleString(),
  },
  published: {
    title: 'Published',
    dataIndex: 'published',
    key: 'published',
    width: COL_WIDTHS.published,
    render: (value: number) => value?.toLocaleString(),
  },
  variance: {
    title: 'Variance',
    dataIndex: 'variance',
    key: 'variance',
    width: COL_WIDTHS.variance,
    render: (value: number) => <VarianceCell value={value} />,
  },
  delivered: {
    title: 'Delivered',
    dataIndex: 'delivered',
    key: 'delivered',
    width: COL_WIDTHS.delivered,
    render: (value: number | null) => (value !== null ? value.toLocaleString() : '-'),
  },
  held: {
    title: 'Held',
    dataIndex: 'held',
    key: 'held',
    width: COL_WIDTHS.held,
    render: (value: number | undefined) => (value !== undefined ? value.toLocaleString() : '-'),
  },
  status: {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: COL_WIDTHS.status,
    ...statusFilterConfig,
    filteredValue: handlers.statusFilter.length ? handlers.statusFilter : null,
    render: (status: PacingSummaryStatus) => <PacingStatusTag status={status} />,
  },
});

const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

export const generateColumnsFromData = (
  dataKeys: string[],
  pacingType: string,
  handlers: SortHandlers,
  showDelivered: boolean,
  isChild?: boolean,
) => {
  const columnConfig = getColumnConfig(pacingType, handlers, isChild);
  const columns: any[] = [];

  for (const key of dataKeys) {
    if (HIDDEN_KEYS.has(key)) continue;
    if (key === 'delivered' && !showDelivered) continue;

    if (columnConfig[key]) {
      columns.push(columnConfig[key]);
    } else {
      columns.push({
        title: capitalize(key),
        dataIndex: key,
        key,
      });
    }
  }

  if (pacingType !== 'Daily' && !isChild) {
    columns.push({
      title: '',
      key: 'viewDetails',
      width: COL_WIDTHS.viewDetails,
    });
  }

  return columns;
};
