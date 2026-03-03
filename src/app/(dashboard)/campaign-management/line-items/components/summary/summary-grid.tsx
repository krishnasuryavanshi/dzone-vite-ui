
import { FC, useState, useCallback, useMemo } from 'react';
import { Table } from '@/uicomponents/table';
import { Text } from '@/uicomponents/text';
import { useScrollableTableHeight } from '@/lib/hooks';
import { IPacingSummaryRow } from '../../lib/types';
import { generateColumnsFromData } from './summary-grid-columns';
import { SummaryChildTable } from './summary-child-table';
import { usePacingSummaryStore } from '../../store';
import styles from './summary.module.css';
import './summary-grid.scss';

interface ISummaryGridProps {
  gridData: IPacingSummaryRow[];
  pacingType: string;
  showDelivered: boolean;
}

const StaticContentHeight = 330;

export const SummaryGrid: FC<ISummaryGridProps> = ({
  gridData,
  pacingType,
  showDelivered,
}) => {
  const { sortOrder, statusFilter, setSortOrder, setStatusFilter, isLoading } =
    usePacingSummaryStore();

  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const { scrollableTableHeight } =
    useScrollableTableHeight(StaticContentHeight);

  const handleSort = useCallback(() => {
    let newOrder: 'ASC' | 'DESC' | null = 'ASC';
    if (sortOrder === 'ASC') newOrder = 'DESC';
    else if (sortOrder === 'DESC') newOrder = null;
    setSortOrder(newOrder);
  }, [sortOrder, setSortOrder]);

  const handleStatusFilter = useCallback(
    (values: string[]) => {
      setStatusFilter(values);
    },
    [setStatusFilter],
  );

  const handleTableChange = useCallback(
    (_pagination: any, filters: any) => {
      const statusValues = filters?.status ?? [];
      handleStatusFilter(statusValues);
    },
    [handleStatusFilter],
  );

  const handleExpandToggle = useCallback((rowId: string) => {
    setExpandedRowKeys((prev) =>
      prev.includes(rowId) ? prev.filter((k) => k !== rowId) : [...prev, rowId],
    );
  }, []);

  const filteredData = useMemo(() => {
    if (statusFilter.length === 0) return gridData;
    return gridData.filter((row) => statusFilter.includes(row.status));
  }, [gridData, statusFilter]);

  const sortHandlers = {
    sortOrder,
    onSort: handleSort,
    statusFilter,
    onStatusFilter: handleStatusFilter,
  };

  const isDaily = pacingType === 'Daily';

  const toDateValue = useCallback((value: string | undefined) => {
    if (!value) return 0;
    const d = new Date(value);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }, []);

  const dataSource = useMemo(() => {
    let source = isDaily
      ? (gridData[0]?.dailyBreakdown ?? []).map((s) => ({ ...s, key: s.id }))
      : filteredData.map((row) => ({ ...row, key: row.id }));

    if (isDaily && statusFilter.length > 0) {
      source = source.filter((row) => statusFilter.includes(row.status));
    }

    if (!sortOrder) return source;

    return [...source].sort((a, b) => {
      const aVal = isDaily
        ? toDateValue(a.periodLabel)
        : toDateValue((a as unknown as IPacingSummaryRow).periodStartDate);
      const bVal = isDaily
        ? toDateValue(b.periodLabel)
        : toDateValue((b as unknown as IPacingSummaryRow).periodStartDate);
      return sortOrder === 'ASC' ? aVal - bVal : bVal - aVal;
    });
  }, [gridData, filteredData, isDaily, sortOrder, statusFilter, toDateValue]);

  const dataKeys = useMemo(() => {
    const firstItem = isDaily ? gridData[0]?.dailyBreakdown?.[0] : gridData[0];
    return firstItem ? Object.keys(firstItem) : [];
  }, [gridData, isDaily]);

  const columns = generateColumnsFromData(
    dataKeys,
    pacingType,
    sortHandlers,
    showDelivered,
  );

  if (!isDaily) {
    const viewDetailsCol = columns.find(
      (col: any) => col.key === 'viewDetails',
    );
    if (viewDetailsCol) {
      viewDetailsCol.render = (
        _: any,
        record: IPacingSummaryRow & { key: string },
      ) => (
        <Text
          className={styles.expandToggle}
          onClick={() => handleExpandToggle(record.key)}>
          {expandedRowKeys.includes(record.key)
            ? 'Hide Details'
            : 'View Details'}
        </Text>
      );
    }
  }

  const childKeys = useMemo(() => {
    const firstChild = gridData[0]?.dailyBreakdown?.[0];
    return firstChild ? Object.keys(firstChild) : [];
  }, [gridData]);

  const expandable = !isDaily
    ? {
        expandedRowKeys,
        showExpandColumn: false,
        expandedRowRender: (record: IPacingSummaryRow) => (
          <SummaryChildTable
            breakdown={record.dailyBreakdown ?? []}
            columnKeys={childKeys}
            pacingType={pacingType}
            showDelivered={showDelivered}
          />
        ),
      }
    : undefined;

  return (
    <Table
      className='table dz-table pacing-summary-grid'
      columns={columns as any}
      dataSource={dataSource as any}
      loading={isLoading}
      pagination={false}
      scroll={{ x: 'max-content', y: scrollableTableHeight }}
      sticky
      onChange={handleTableChange}
      expandable={expandable as any}
    />
  );
};
