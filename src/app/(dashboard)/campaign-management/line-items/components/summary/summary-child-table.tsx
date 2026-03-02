'use client';

import { FC, useState, useCallback, useMemo } from 'react';
import { Table } from '@/uicomponents/table';
import { IPacingDailyBreakdown } from '../../lib/types';
import { generateColumnsFromData } from './summary-grid-columns';

interface ISummaryChildTableProps {
  breakdown: IPacingDailyBreakdown[];
  columnKeys: string[];
  pacingType: string;
  showDelivered: boolean;
}

const toDateValue = (value: string | undefined) => {
  if (!value) return 0;
  const d = new Date(value);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
};

export const SummaryChildTable: FC<ISummaryChildTableProps> = ({
  breakdown,
  columnKeys,
  pacingType,
  showDelivered,
}) => {
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC' | null>(null);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const handleSort = useCallback(() => {
    let newOrder: 'ASC' | 'DESC' | null = 'ASC';
    if (sortOrder === 'ASC') newOrder = 'DESC';
    else if (sortOrder === 'DESC') newOrder = null;
    setSortOrder(newOrder);
  }, [sortOrder]);

  const handleStatusFilter = useCallback((values: string[]) => {
    setStatusFilter(values);
  }, []);

  const handleTableChange = useCallback(
    (_pagination: any, filters: any) => {
      const statusValues = filters?.status ?? [];
      handleStatusFilter(statusValues);
    },
    [handleStatusFilter],
  );

  const sortHandlers = {
    sortOrder,
    onSort: handleSort,
    statusFilter,
    onStatusFilter: handleStatusFilter,
  };

  const columns = generateColumnsFromData(
    columnKeys,
    pacingType,
    sortHandlers,
    showDelivered,
    true,
  );

  const dataSource = useMemo(() => {
    let rows = breakdown.map((s) => ({ ...s, key: s.id }));
    if (statusFilter.length > 0) {
      rows = rows.filter((r) => statusFilter.includes(r.status));
    }
    if (sortOrder) {
      rows = [...rows].sort((a, b) => {
        const aVal = toDateValue(a.periodLabel);
        const bVal = toDateValue(b.periodLabel);
        return sortOrder === 'ASC' ? aVal - bVal : bVal - aVal;
      });
    }
    return rows;
  }, [breakdown, statusFilter, sortOrder]);

  return (
    <Table
      className='pacing-child-table'
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      size='small'
      onChange={handleTableChange}
    />
  );
};
