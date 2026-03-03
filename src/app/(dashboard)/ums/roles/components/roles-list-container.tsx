import { Hideable, TableWithPaginationLayout } from '@/components/shared';
import { RolesList } from './roles-list';
import { useMemo, useState } from 'react';
import { IRoles } from '../lib/types';
import { RoleHeader } from './role-header';
import { ScreenLoader } from '@/components/shared/loader';
import { SimplePagination } from '@/uicomponents';
import { useRolesListQuery, useUpdateRoleStatusMutation } from '../hooks';

export const RolesListContainer = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const hasValidPagination = currentPage > 0 && pageSize > 0;
  const { data, isLoading } = useRolesListQuery(
    currentPage - 1,
    pageSize,
    hasValidPagination,
  );

  const updateStatusMutation = useUpdateRoleStatusMutation();

  const allRoles = useMemo(
    () =>
      data?.data?.map((role: IRoles) => ({
        ...role,
        key: role.id,
      })) ?? [],
    [data],
  );
  const totalRecords = data?.total ?? 0;

  const updateRolesStatus = async (id: string, statusName: string) => {
    updateStatusMutation.mutate({ id, status: statusName });
  };

  if (isLoading) return <ScreenLoader />;

  const handlePaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  return (
    <TableWithPaginationLayout
      header={<RoleHeader />}
      table={
        <RolesList allRoles={allRoles} updateRolesStatus={updateRolesStatus} />
      }
      pagination={
        <Hideable show={totalRecords > 0}>
          <SimplePagination
            current={currentPage}
            total={totalRecords}
            pageSize={pageSize}
            onChange={handlePaginationChange}
          />
        </Hideable>
      }
    />
  );
};
