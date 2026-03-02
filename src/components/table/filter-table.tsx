import { useEffect, useState } from 'react';
import { BasicTable, ITableProps } from './basic-table';
import { TableProps } from 'antd/lib/table';

export function FilterTable<T>({ ...rest }: ITableProps<T>) {
  const [filteredColumns, setFilteredColumns] = useState<
    TableProps<T>['columns']
  >([]);

  useEffect(() => {
    setFilteredColumns(rest.columns);
  }, [rest.columns]);

  return (
    <BasicTable
      {...rest}
      columns={filteredColumns}
    />
  );
}
