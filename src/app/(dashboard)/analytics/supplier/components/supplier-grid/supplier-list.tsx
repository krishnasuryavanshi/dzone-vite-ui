import { FC, useState } from 'react';
import { Filters } from '@/lib/utils/table';
import { BasicTable } from '@/components/table';
import { useScrollableTableHeight } from '@/lib/hooks';
import { supplierColumnConfig } from '../risk-line-items-grid/column-config';
import { ISupplierGrids } from '../../types/supplier-grids';
import { Input } from '@/uicomponents/form/input';
import { Space } from '@/uicomponents/layout';
import { Button } from '@/uicomponents/button';
import { ColumnType } from '@/lib/types/uicomponents';
import { SearchOutlined } from '@/uicomponents/icons';

interface ISupplierGridsProps {
  lists: ISupplierGrids[];
  filterInfo: Filters<ISupplierGrids>;
  onFiltersChange?: (filters: Record<string, any>) => void;
  hasFilters?: boolean;
}

interface DataType {
  key: React.Key;
  [key: string]: any;
}

const StaticContentHeight = 200;
const getColumnSearchProps = (
  dataIndex: string,
  searchText: string,
  setSearchText: React.Dispatch<React.SetStateAction<string>>,
  searchedColumn: string,
  setSearchedColumn: React.Dispatch<React.SetStateAction<string>>,
): ColumnType<DataType> => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => {
          confirm();
          setSearchText(selectedKeys[0] ? String(selectedKeys[0]) : '');
          setSearchedColumn(dataIndex);
        }}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type='primary'
          // and similarly for the onClick of Search button
          onClick={() => {
            confirm();
            setSearchText(selectedKeys[0] ? String(selectedKeys[0]) : '');
            setSearchedColumn(dataIndex);
          }}
          icon={<SearchOutlined />}
          size='small'
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => {
            clearFilters?.();
            setSearchText('');
            setSearchedColumn('');
            confirm();
          }}
          size='small'
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
  ),
  onFilter: (value, record) =>
    record[dataIndex]
      ? record[dataIndex]
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase())
      : false,
  render: (text) =>
    searchedColumn === dataIndex ? (
      <span style={{ backgroundColor: '#ffc069', padding: 0 }}>{text}</span>
    ) : (
      text
    ),
});
export const SupplierLists: FC<ISupplierGridsProps> = ({
  lists,
  filterInfo,
  onFiltersChange,
  hasFilters,
}) => {
  const { scrollableTableHeight } = useScrollableTableHeight(StaticContentHeight);
  const [searchText, setSearchText] = useState<string>('');
  const [searchedColumn, setSearchedColumn] = useState<string>('');
  const mappedColumns: ColumnType<DataType>[] = supplierColumnConfig.map((col) => {
    const searchProps = getColumnSearchProps(
      col.dataIndex as string,
      searchText,
      setSearchText,
      searchedColumn,
      setSearchedColumn,
    );

    // Preserve the original render function if it exists
    return {
      ...col,
      ...searchProps,
      render: col.render || searchProps.render,
    };
  });

  const handleChange = (data: any) => {
    if (onFiltersChange) {
      onFiltersChange(data?.filters);
    }
  };

  // Assign a class based on the row status
  const getRowClassName = (record: any) => {
    let className = '';
    if (record.at_risk_reason) {
      className = 'at-risk-reason';
    }
    return className;
  };

  return (
    <BasicTable
      className='row-hover-highlight'
      style={{ marginTop: '1rem' }}
      columns={mappedColumns}
      data={lists as any}
      hasPagination={false}
      handleChange={handleChange}
      scrollableHeight={scrollableTableHeight}
      rowClassName={getRowClassName}
    />
  );
};
