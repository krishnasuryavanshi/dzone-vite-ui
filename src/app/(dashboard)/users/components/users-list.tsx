import { Text } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { TableProps } from 'antd/lib/table';
import { UserAvatar } from './user-avatar';

import { Translate } from '@/components/i18n';
import { BasicTable } from '@/components/table';
import { UserStatus } from '../../components';
import { UserAction } from './user-action';
import './users-list.scss';

interface DataType {
  id: number;
  avatar?: string;
  name: string;
  email: string;
  phone: string;
  created: string;
  status: { name: string; value: string };
}

export const UsersList = () => {
  const columns: TableProps<DataType>['columns'] = [
    {
      title: <Translate i18nKey='label.name' />,
      dataIndex: 'name',
      key: 'name',
      render: (name, { avatar }) => (
        <Flex gap='0.75rem' align='center'>
          <UserAvatar url={avatar} />
          <Text>{name}</Text>
        </Flex>
      ),
    },
    {
      title: <Translate i18nKey='label.email' />,
      dataIndex: 'email',
      key: 'email',
      render: (email) => <Text>{email}</Text>,
    },
    {
      title: <Translate i18nKey='label.phone' />,
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => <Text>{phone}</Text>,
    },
    {
      title: <Translate i18nKey='label.created' />,
      dataIndex: 'created',
      key: 'created',
      render: (created) => <Text>{created}</Text>,
    },
    {
      title: <Translate i18nKey='label.status' />,
      dataIndex: 'status',
      key: 'status',
      render: (status: { name: string; value: string }) => {
        if (!status?.name || !status?.value) {
          return null;
        }
        return <UserStatus {...status} />;
      },
    },
    {
      title: <Translate i18nKey='label.actions' />,
      dataIndex: 'actions',
      render: () => <UserAction />,
    },
  ];

  const data: DataType[] = [
    {
      id: 1,
      avatar: 'images/user-avatar.png',
      name: 'John Brown',
      email: 'uQgFP@example.com',
      phone: '1234567890',
      created: '09:25 am, 23 jan 2024',
      status: {
        name: 'ACTIVE',
        value: 'Active',
      },
    },
    {
      id: 2,
      name: 'John Brown',
      email: 'uQgFP@example.com',
      phone: '1234567890',
      created: '09:25 am, 23 jan 2024',
      status: {
        name: 'ACTIVE',
        value: 'Active',
      },
    },
    {
      id: 3,
      name: 'John Brown',
      email: 'uQgFP@example.com',
      phone: '1234567890',
      created: '09:25 am, 23 jan 2024',
      status: {
        name: 'INACTIVE',
        value: 'Inactive',
      },
    },
  ];

  return (
    <BasicTable style={{ marginTop: '1rem' }} columns={columns} data={data} hasPagination={false} />
  );
};
