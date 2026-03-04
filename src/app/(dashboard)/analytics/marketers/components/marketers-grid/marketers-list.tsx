import { FC, useState } from 'react';
import { BasicTable } from '@/components/table';
import { useScrollableTableHeight } from '@/lib/hooks';
import { marketerColumnConfig } from '../risk-to-launch-grid/column-config';
import { Input } from '@/uicomponents/form/input';
import { Space } from '@/uicomponents/layout/space';
import { Button } from '@/uicomponents/button';
import { SearchOutlined } from '@/uicomponents/icons';
import { ColumnType } from '@/lib/types/uicomponents';
import {
  DataType,
  IMarketersGridsProps,
  SearchEventArg,
  TableRecord,
} from '../risk-to-launch-grid/types/risktolaunch-grid';

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
  onFilter: (value, record) => {
    const cellValue = record[dataIndex];
    if (!cellValue) return false;

    // Handle different types of cell values
    let searchValue = '';
    if (Array.isArray(cellValue)) {
      searchValue = cellValue.join(', ');
    } else if (typeof cellValue === 'object' && cellValue.props && cellValue.props.children) {
      // Handle React element objects
      searchValue = String(cellValue.props.children);
    } else if (typeof cellValue === 'object' && cellValue.text) {
      searchValue = cellValue.text;
    } else {
      searchValue = String(cellValue);
    }

    return searchValue.toLowerCase().includes((value as string).toLowerCase());
  },
});
export const MarketersLists: FC<IMarketersGridsProps> = ({
  lists,
  filterInfo,
  onFiltersChange,
  hasFilters,
}) => {
  const { scrollableTableHeight } = useScrollableTableHeight(StaticContentHeight);
  const [searchText, setSearchText] = useState<string>('');
  const [searchedColumn, setSearchedColumn] = useState<string>('');
  const mappedColumns: ColumnType<DataType>[] = marketerColumnConfig.map((col) => {
    const searchProps = getColumnSearchProps(
      col.dataIndex as string,
      searchText,
      setSearchText,
      searchedColumn,
      setSearchedColumn,
    );

    return {
      ...col,
      ...searchProps,
      render: col.render || searchProps.render, // Preserve original render if it exists
    };
  });

  const handleChange = (data: SearchEventArg) => {
    if (onFiltersChange) {
      onFiltersChange(data.filters);
    }
  };

  // Assign a class based on the row status
  const getRowClassName = (record: TableRecord) => {
    let className = '';
    if (record.at_risk_reason_to_launch) {
      className = 'at-risk-reason';
    } else if (record.at_risk_to_deliver && record.at_risk_to_deliver !== '%') {
      className = 'at-risk-deliver';
    }
    return className;
  };

  return (
    <BasicTable
      className='row-hover-highlight'
      style={{ marginTop: '1rem' }}
      columns={mappedColumns}
      data={lists}
      hasPagination={false}
      handleChange={handleChange}
      scrollableHeight={scrollableTableHeight}
      rowClassName={getRowClassName}
    />
  );
};
