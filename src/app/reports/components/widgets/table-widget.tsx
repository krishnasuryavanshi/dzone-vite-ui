import React, { useMemo } from 'react';
import { Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { TableWidgetConfig, TableColumnConfig } from '../../lib/types';
import { useWidgetData } from '../../hooks';
import { InlineBarCell } from './inline-bar-cell';

interface TableWidgetProps {
  config: TableWidgetConfig;
}

export const TableWidget: React.FC<TableWidgetProps> = ({ config }) => {
  const { data, isLoading } = useWidgetData(config);

  const columns = useMemo(() => {
    return buildColumns(config.table.columns, (data as Record<string, any>[]) ?? []);
  }, [config.table.columns, data]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin />
      </div>
    );
  }

  return (
    <Table
      dataSource={(data as Record<string, any>[]) ?? []}
      columns={columns}
      rowKey={config.table.rowKey}
      pagination={
        config.table.pagination
          ? { pageSize: config.table.pageSize ?? 10, size: 'small' }
          : false
      }
      size="small"
      scroll={{ x: 'max-content' }}
    />
  );
};

function buildColumns(
  colConfigs: TableColumnConfig[],
  data: Record<string, any>[],
): ColumnsType<Record<string, any>> {
  return colConfigs.map((col) => {
    const column: ColumnsType<Record<string, any>>[number] = {
      key: col.key,
      title: col.title,
      dataIndex: col.dataIndex,
      width: col.width,
      sorter: col.sortable
        ? (a: Record<string, any>, b: Record<string, any>) => {
            const aVal = a[col.dataIndex];
            const bVal = b[col.dataIndex];
            if (typeof aVal === 'number' && typeof bVal === 'number') return aVal - bVal;
            return String(aVal).localeCompare(String(bVal));
          }
        : undefined,
    };

    if (col.inlineBar) {
      const max = Math.max(...data.map((row) => Number(row[col.dataIndex]) || 0));
      column.render = (value: number) => (
        <InlineBarCell value={value} max={max} color={col.inlineBar!.color} />
      );
    }

    return column;
  });
}
