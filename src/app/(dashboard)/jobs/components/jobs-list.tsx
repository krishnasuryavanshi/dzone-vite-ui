import { FC, useMemo } from 'react';
import { Table } from '@/uicomponents/table';
import { useScrollableTableHeight } from '@/lib/hooks';
import { Filters, Sorter } from '@/lib/utils/table';
import { IJob } from '../lib/types';
import { getJobsColumns } from './jobs-columns';

const StaticContentHeight = 216;

interface JobsListProps {
  jobs: IJob[];
  filterInfo: Filters<IJob>;
  sorterInfo: Sorter<IJob>;
  handleFiltersChange: (filters: Filters<IJob>) => void;
  handleSorterChange: (sorter: Sorter<IJob>) => void;
  onRowClick: (job: IJob) => void;
  hideLineItemColumn?: boolean;
}

export const JobsList: FC<JobsListProps> = ({
  jobs,
  filterInfo,
  sorterInfo,
  handleFiltersChange,
  handleSorterChange,
  onRowClick,
  hideLineItemColumn = false,
}) => {
  const { scrollableTableHeight } = useScrollableTableHeight(StaticContentHeight);

  const columns = useMemo(
    () => getJobsColumns({ filterInfo, sorterInfo, hideLineItemColumn }),
    [filterInfo, sorterInfo, hideLineItemColumn],
  );

  const handleChange = (_pagination: any, filters: Filters<IJob>, sorter: Sorter<IJob>) => {
    handleFiltersChange(filters);
    handleSorterChange(sorter);
  };

  return (
    <Table<IJob>
      className='dz-table'
      columns={columns}
      dataSource={jobs}
      rowKey='id'
      pagination={false}
      onChange={handleChange as any}
      scroll={{ x: 'max-content', y: scrollableTableHeight }}
      onRow={(record) => ({
        onClick: () => onRowClick(record),
        style: { cursor: 'pointer' },
      })}
    />
  );
};
