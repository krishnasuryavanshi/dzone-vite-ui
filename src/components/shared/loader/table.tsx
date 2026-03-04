import React, { FC } from 'react';
import { Table } from '@/uicomponents/table';
import { SkeletonButton, SkeletonInput } from '@/uicomponents/layout/skeleton';

export const TableLoader: FC = () => {
  const columns = [
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <SkeletonInput style={{ width: 100 }} active />,
    },
    {
      title: '',
      dataIndex: 'age',
      key: 'age',
      render: (text: string) => <SkeletonInput style={{ width: 50 }} active />,
    },
    {
      title: '',
      dataIndex: 'address',
      key: 'address',
      render: (text: string) => <SkeletonInput style={{ width: 200 }} active />,
    },
    {
      title: '',
      key: 'action',
      render: () => <SkeletonButton style={{ width: 80 }} active />,
    },
  ];

  return <Table columns={columns} dataSource={[{}, {}, {}, {}]} pagination={false} />;
};
