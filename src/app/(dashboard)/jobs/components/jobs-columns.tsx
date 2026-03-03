
import { TableProps } from '@/lib/types/uicomponents';
import { createColumn, Filters, Sorter } from '@/lib/utils/table';
import { IJob } from '../lib/types';
import { JobStatusBadge } from './job-status-badge';
import { JobTypeBadge } from './job-type-badge';
import dayjs from 'dayjs';

const formatDate = (date: string) => {
  if (!date) return '-';
  return dayjs.utc(date).tz(dayjs.tz.guess()).format('DD MMM YYYY, hh:mm A');
};

const JOB_TYPE_FILTERS = ['UPSERT', 'VALIDATION', 'PUBLISH', 'REVALIDATION'];

const JOB_STATUS_FILTERS = [
  'PENDING',
  'IN_PROGRESS',
  'SUCCESS',
  'FAILED',
  'CANCELLED',
];

interface GetJobsColumnsProps {
  filterInfo: Filters<IJob>;
  sorterInfo: Sorter<IJob>;
  hideLineItemColumn?: boolean;
}

export const getJobsColumns = ({
  filterInfo,
  sorterInfo,
  hideLineItemColumn = false,
}: GetJobsColumnsProps): TableProps<IJob>['columns'] => {
  const column = createColumn<IJob>(true, filterInfo);
  const sorter = Array.isArray(sorterInfo) ? sorterInfo[0] : sorterInfo;

  const columns = [
    column(
      'Job ID',
      'jobId',
      {
        width: 150,
        ellipsis: true,
      },
      (jobId: string) => jobId?.split('-').pop()?.toUpperCase(),
    ),
    !hideLineItemColumn &&
      column('Line Item ID', 'lineItemId', {
        width: 150,
        ellipsis: true,
        isSearchable: true,
      }),
    column(
      'Job Type',
      'jobType',
      {
        width: 150,
        filters: JOB_TYPE_FILTERS,
        isFilterable: true,
      },
      (jobType: IJob['jobType']) => <JobTypeBadge jobType={jobType} />,
    ),
    column(
      'Status',
      'status',
      {
        width: 130,
        filters: JOB_STATUS_FILTERS,
        isFilterable: true,
      },
      (status: IJob['status']) => <JobStatusBadge status={status} />,
    ),
    column('Total', 'totalCount', {
      width: 150,
    }),
    column('Success', 'successCount', {
      width: 150,
    }),
    column('Skipped', 'skippedCount', {
      width: 150,
    }),
    column('Invalid', 'invalidCount', {
      width: 150,
    }),
    column(
      'Started On',
      'startedAt',
      {
        width: 180,
        sorter: true,
        sortOrder: sorter?.field === 'startedAt' ? sorter.order : undefined,
        isDateRangeObjectFilter: true,
      },
      formatDate,
    ),
    column(
      'Completed On',
      'completedAt',
      {
        width: 180,
        isDateRangeObjectFilter: true,
      },
      formatDate,
    ),
    column('User', 'email', {
      width: 200,
      ellipsis: true,
      isSearchable: true,
    }),
  ].filter(Boolean);

  return columns as TableProps<IJob>['columns'];
};
