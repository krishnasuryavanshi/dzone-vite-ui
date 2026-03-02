'use client';
import { Hideable, TableWithPaginationLayout } from '@/components/shared';
import { ScreenLoader } from '@/components/shared/loader';
import { HasPermission } from '@/components/auth';
import { UserActionsEnum } from '@/lib/enums/permissions';
import { useQueryState } from '@/lib/hooks';
import { showNotification } from '@/services/notification';
import { SimplePagination } from '@/uicomponents';
import { WarningOutlined } from '@/uicomponents/icons';
import { Modal } from '@/uicomponents/modal';
import { Text } from '@/uicomponents/text';
import { useEffect, useState } from 'react';
import { IUser } from '../lib/types';
import {
  activateUser,
  adminResendSetPasswordLink,
  deactivateUser,
  fetchUsers,
} from '../services';
import { CreateNewUser } from './create-new-user';
import { UsersTitle } from './users-title';
import { UsersList } from './users-list';
import { Filters } from '@/lib/utils/table';
import { Flex } from '@/uicomponents/layout';

export const UsersListContainer = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modal, contextHolder] = Modal.useModal();
  const [filteredInfo, setFilteredInfo] = useState<Filters<IUser>>({});

  const { queryState, setQueryState } = useQueryState();

  const org = queryState?.org as string | undefined;
  const orgName = queryState?.orgName
    ? decodeURIComponent(queryState.orgName as string)
    : undefined;

  useEffect(() => {
    if (queryState) {
      let { page, pageSize, roleId } = queryState;
      const pageNo = Number(page);
      const size = Number(pageSize);

      if (pageNo && size) {
        setCurrentPage(pageNo);
        setPageSize(size);
        fetchUsersList(pageNo, size, roleId, org);
      } else {
        setQueryState([
          { name: 'page', value: pageNo || 1 },
          { name: 'pageSize', value: size || 25 },
        ]);
      }
    }
  }, [queryState, filteredInfo]);

  const handlePageChange = (page: number, size: number) => {
    setQueryState([
      { name: 'page', value: page },
      { name: 'pageSize', value: size },
    ]);
  };

  const confirm = (username: string) => {
    modal.confirm({
      closable: true,
      title: 'Deactivating the user',
      icon: <WarningOutlined style={{ color: '#E04149' }} />,
      content: (
        <Text>
          Deactivating this user (
          <Text style={{ color: '#3D71FB' }}>{username}</Text>) will immediately
          revoke their access and permissions associated with the role. Do you
          want to proceed?
        </Text>
      ),
      okText: 'Deactivate',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: () => {
        deactivateUserRecord({ username } as IUser);
      },
    });
  };

  const fetchUsersList = async (
    currentPage: number,
    pageSize: number,
    roleId?: string,
    org?: string,
  ) => {
    setIsLoading(true);
    const username = filteredInfo?.username?.[0] || '';
    const { data, total } = await fetchUsers(
      currentPage - 1,
      pageSize,
      roleId,
      username as string,
      org,
    );
    setUsers(data.map((user: IUser) => ({ ...user, key: user.id })));
    setTotalRecords(total);
    setIsLoading(false);
  };

  const toggleStatus = (user: IUser) => {
    const status = user.status;
    try {
      if (status === 'Deactivated') {
        activateUserRecord(user);
      } else {
        confirm(user.username);
      }
    } catch (error) {}
  };

  const activateUserRecord = async (user: IUser) => {
    try {
      const data = await activateUser(user.username);
      showNotification({
        type: 'success',
        message: data?.message,
      });
      handleRefreshList(data?.data);
    } catch (error) {}
  };

  const deactivateUserRecord = async (user: IUser) => {
    try {
      const data = await deactivateUser(user.username);
      showNotification({
        type: 'success',
        message: data?.message,
      });
      handleRefreshList(data?.data);
    } catch (error) {}
  };

  const resendSetPasswordLink = async (user: IUser) => {
    try {
      const data = await adminResendSetPasswordLink(user.username);
      showNotification({
        type: 'success',
        message: data?.message,
      });
      handleRefreshList(data?.data);
    } catch (error) {}
  };

  const handleRefreshList = (user: IUser) => {
    const usersList = [...users];
    const index = usersList.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      usersList[index] = { ...usersList[index], ...user };
    }
    setUsers(usersList);
  };

  const handleFiltersChange = (filters: Record<string, any> = {}) => {
    // filter out the falsy value keys
    const filteredKeys = Object.keys(filters).reduce(
      (acc, key) => {
        if (filters[key]) {
          acc[key] = filters[key];
        }
        return acc;
      },
      {} as Record<string, any>,
    );
    setFilteredInfo(filteredKeys);
    handlePageChange(1, pageSize);
  };

  if (isLoading) return <ScreenLoader />;

  return (
    <>
      <TableWithPaginationLayout
        header={
          <Flex gap='0.75rem' justify='space-between' align='center'>
            <UsersTitle orgName={orgName} />
            <HasPermission permissions={UserActionsEnum.Create}>
              <CreateNewUser />
            </HasPermission>
          </Flex>
        }
        table={
          <UsersList
            users={users}
            toggleStatus={toggleStatus}
            resendSetPasswordLink={resendSetPasswordLink}
            filterInfo={filteredInfo}
            onFiltersChange={handleFiltersChange}
            emptyText={
              org ? (
                <Flex
                  justify='center'
                  align='center'
                  gap='0.5rem'
                  style={{ marginTop: '1rem' }}>
                  <Text style={{ color: '#707070' }}>
                    No users are mapped to {orgName || 'this organization'}
                  </Text>
                </Flex>
              ) : undefined
            }
          />
        }
        pagination={
          <Hideable show={totalRecords > 0}>
            <SimplePagination
              current={currentPage}
              pageSize={pageSize}
              total={totalRecords}
              onChange={handlePageChange}
            />
          </Hideable>
        }
      />
      {contextHolder}
    </>
  );
};
