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
import { adminResendSetPasswordLink } from '../services';
import { useUsersQuery } from '../hooks/use-users-query';
import { useActivateUserMutation } from '../hooks/use-activate-user-mutation';
import { useDeactivateUserMutation } from '../hooks/use-deactivate-user-mutation';
import { CreateNewUser } from './create-new-user';
import { UsersTitle } from './users-title';
import { UsersList } from './users-list';
import { Filters } from '@/lib/utils/table';
import { Flex } from '@/uicomponents/layout';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';

export const UsersListContainer = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [modal, contextHolder] = Modal.useModal();
  const [filteredInfo, setFilteredInfo] = useState<Filters<IUser>>({});
  const queryClient = useQueryClient();

  const { queryState, setQueryState } = useQueryState();

  const org = queryState?.org as string | undefined;
  const orgName = queryState?.orgName
    ? decodeURIComponent(queryState.orgName as string)
    : undefined;

  const roleId = queryState?.roleId as string | undefined;
  const username = (filteredInfo?.username?.[0] || '') as string;
  const hasValidPagination = currentPage > 0 && pageSize > 0;

  const { data, isLoading } = useUsersQuery(
    currentPage - 1,
    pageSize,
    roleId,
    username,
    org,
    hasValidPagination,
  );

  const users = (data?.data ?? []).map((user: IUser) => ({ ...user, key: user.id }));
  const totalRecords = data?.total ?? 0;

  const activateUserMutation = useActivateUserMutation();
  const deactivateUserMutation = useDeactivateUserMutation();

  useEffect(() => {
    if (queryState) {
      let { page, pageSize } = queryState;
      const pageNo = Number(page);
      const size = Number(pageSize);

      if (pageNo && size) {
        setCurrentPage(pageNo);
        setPageSize(size);
      } else {
        setQueryState([
          { name: 'page', value: pageNo || 1 },
          { name: 'pageSize', value: size || 25 },
        ]);
      }
    }
  }, [queryState]);

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
          Deactivating this user (<Text style={{ color: '#3D71FB' }}>{username}</Text>) will
          immediately revoke their access and permissions associated with the role. Do you want to
          proceed?
        </Text>
      ),
      okText: 'Deactivate',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: () => {
        deactivateUserMutation.mutate(username);
      },
    });
  };

  const toggleStatus = (user: IUser) => {
    const status = user.status;
    if (status === 'Deactivated') {
      activateUserMutation.mutate(user.username);
    } else {
      confirm(user.username);
    }
  };

  const resendSetPasswordLink = async (user: IUser) => {
    try {
      const data = await adminResendSetPasswordLink(user.username);
      showNotification({
        type: 'success',
        message: data?.message,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    } catch (error) {}
  };

  const handleFiltersChange = (filters: Record<string, any> = {}) => {
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

  if (isLoading && !data) return <ScreenLoader />;

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
                <Flex justify='center' align='center' gap='0.5rem' style={{ marginTop: '1rem' }}>
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
