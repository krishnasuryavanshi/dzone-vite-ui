import { TableProps } from 'antd/lib/table';
import React from 'react';
import { Table } from '@/uicomponents/table';
import { useResizableColumns } from './use-resizable-columns';
import './basic-table.scss';

export interface ITableProps<T extends Record<string, any>> {
  style?: React.CSSProperties;
  className?: string;
  basicDetailsClassName?: string;
  columns: TableProps<T>['columns'];
  data: T[];
  hasPagination?: any;
  virtual?: boolean;
  scrollableHeight?: number | string;
  onClick?: (record: T) => void;
  rowHref?: (record: T) => string | undefined;
  handleChange?: (data: any) => void;
  rowSelection?: TableProps<T>['rowSelection'];
  rowClassName?: any;
  resizable?: boolean;
  emptyText?: React.ReactNode;
}

export function BasicTable<T extends Record<string, any>>({
  style,
  columns: initialColumns,
  className,
  basicDetailsClassName,
  data,
  hasPagination = false,
  virtual = true,
  scrollableHeight = 'max-content',
  rowSelection,
  onClick,
  rowHref,
  handleChange,
  rowClassName,
  resizable = false,
  emptyText,
}: ITableProps<T>) {
  // Use the resizable columns hook to handle all resizing logic
  const { columns: processedColumns, components } = useResizableColumns(initialColumns, resizable);

  const onChange: TableProps<T>['onChange'] = (pagination, filters, sorter) => {
    handleChange && handleChange({ pagination, filters, sorter });
  };

  const handleRowClick = (record: T, e: React.MouseEvent) => {
    const href = rowHref?.(record);
    if (href && (e.metaKey || e.ctrlKey || e.shiftKey)) {
      window.open(href, '_blank');
      return;
    }
    onClick && onClick(record);
  };

  const handleAuxClick = (record: T, e: React.MouseEvent) => {
    if (e.button === 1) {
      const href = rowHref?.(record);
      if (href) {
        window.open(href, '_blank');
      }
    }
  };

  return (
    <Table<T>
      className={`table dz-table ${className || ''} ${basicDetailsClassName || ''} ${resizable ? 'resizable-columns' : ''}`}
      style={style}
      columns={processedColumns as TableProps<T>['columns']}
      components={components}
      dataSource={data}
      pagination={hasPagination}
      onChange={onChange}
      virtual={virtual}
      rowSelection={rowSelection}
      scroll={{ x: 'max-content', y: scrollableHeight }}
      onRow={(record) => ({
        onClick: (e) => handleRowClick(record, e),
        onAuxClick: (e) => handleAuxClick(record, e),
      })}
      rowClassName={rowClassName}
      locale={emptyText ? { emptyText } : undefined}
      sticky
    />
  );
}
