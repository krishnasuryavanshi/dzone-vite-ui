import { Hideable, TableWithPaginationLayout } from '@/components/shared';
import { RolesList } from './roles-list';
import { fetchRolesList } from '../services/fetch-roles-list';
import { useEffect, useState } from 'react';
import { IRoles } from '../lib/types';
import { RoleHeader } from './role-header';
import { updateRoleStatus } from '../services';
import { ScreenLoader } from '@/components/shared/loader';
import { SimplePagination } from '@/uicomponents';

export const RolesListContainer = () => {
  const [allRoles, setAllRoles] = useState<IRoles[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStatusUpdate, setIsStatusUpdate] = useState<boolean>(false);

  const fetchRoles = async () => {
    try {
      setIsLoading(!isStatusUpdate);
      const data = await fetchRolesList(currentPage - 1, pageSize);
      setTotalRecords(data.total);
      setAllRoles(
        data?.data?.map((role: IRoles) => ({
          ...role,
          key: role.id,
          // tenantType: role.tenantType,
        })) || [],
      );
    } catch (err) {
    } finally {
      setIsLoading(false);
      setIsStatusUpdate(false);
    }
  };

  const updateRolesStatus = async (id: string, statusName: string) => {
    try {
      setIsStatusUpdate(true);
      const data = await updateRoleStatus(id, statusName);
      if (data) {
        fetchRoles();
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchRoles();
  }, [pageSize, currentPage]);

  if (isLoading && !isStatusUpdate) return <ScreenLoader />;

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
