import {
  useState,
  useImperativeHandle,
  useEffect,
} from 'react';
import { BasicTable } from '@/components/table/basic-table';
import { Button, Tooltip } from '@/uicomponents';
import { DownloadOutlined } from '@ant-design/icons';
import {
  TransformHistoryStatusBadge,
  TransformHistoryStatus,
} from './transform-history-status-badge';
import { TransformationHistoryItem } from '../../services/transformation-history';
import { useTransformationHistoryQuery } from '../../hooks';
import { Space } from '@/uicomponents/layout';
import { TableProps } from '@/lib/types/uicomponents';
import { fileDownload } from '../../services';
import { dateRenderer } from '../../../lib/utils/renderers';

interface TransformHistoryTableProps {
  lineItemId: string;
  onPaginationChange?: (pagination: {
    current: number;
    pageSize: number;
    total: number;
  }) => void;
  ref?: React.Ref<TransformHistoryTableRef>;
}

export interface TransformHistoryTableRef {
  refreshData: () => void;
  handlePageChange: (page: number, pageSize?: number) => void;
}

export const TransformHistoryTable = ({ lineItemId, onPaginationChange, ref }: TransformHistoryTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: response, refetch } = useTransformationHistoryQuery(
    lineItemId,
    page,
    pageSize,
  );

  const data = response?.data ?? [];
  const total = response?.total ?? 0;

  useEffect(() => {
    onPaginationChange?.({
      current: response?.page ?? page,
      pageSize: response?.size ?? pageSize,
      total,
    });
  }, [response, total]);

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      refreshData: () => {
        refetch();
      },
      handlePageChange,
    }),
    [refetch, pageSize],
  );

  const handleDownload = async (fileId: string) => {
    await fileDownload(fileId);
  };

  const columns: TableProps<TransformationHistoryItem>['columns'] = [
    {
      title: 'File Name',
      dataIndex: ['file', 'filename'],
      key: 'filename',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: (filename: string) => {
        if (!filename) return '-';

        return (
          <Tooltip title={filename} placement='topLeft'>
            <span
              style={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '160px',
              }}>
              {filename}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Template Used',
      dataIndex: ['template', 'name'],
      key: 'templateName',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (templateName: string) => {
        if (!templateName) return '-';

        return (
          <Tooltip title={templateName} placement='topLeft'>
            <span
              style={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '130px',
              }}>
              {templateName}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (
        status: TransformHistoryStatus,
        record: TransformationHistoryItem,
      ) => (
        <TransformHistoryStatusBadge
          status={status}
          errorMessage={record.errorMessage}
        />
      ),
    },
    {
      title: 'Exported',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: dateRenderer,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: TransformationHistoryItem) => (
        <Space>
          {record.status === 'SUCCESS' && record.file && (
            <Tooltip title='Download file'>
              <Button
                type='primary'
                icon={<DownloadOutlined />}
                size='small'
                onClick={() => handleDownload(record.file!.id)}>
                Download
              </Button>
            </Tooltip>
          )}
          {record.status === 'PROCESSING' && <span>Processing...</span>}
          {(record.status === 'FAILED' || record.status === 'ERROR') && (
            <span>-</span>
          )}
        </Space>
      ),
    },
  ];

  return (
    <BasicTable
      columns={columns}
      data={data}
      hasPagination={false}
      scrollableHeight={400}
      virtual={false}
      style={{ tableLayout: 'fixed', width: '100%' }}
    />
  );
};
