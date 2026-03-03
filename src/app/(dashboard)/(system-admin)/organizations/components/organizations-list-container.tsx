import { Hideable, TableWithPaginationLayout } from '@/components/shared';
import { ScreenLoader } from '@/components/shared/loader';
import { useQueryState } from '@/lib/hooks';
import { SimplePagination } from '@/uicomponents';
import { WarningOutlined } from '@/uicomponents/icons';
import { Modal } from '@/uicomponents/modal';
import { Text } from '@/uicomponents/text';
import { useEffect, useState } from 'react';
import { IOrganization } from '../lib/types';
import { Filters, Sorter } from '@/lib/utils/table';
import { OrganizationList } from './organization-list';
import { OrganizationsListHeader } from './organizations-list-header';
import { useOrganizationsQuery } from '../hooks/use-organizations-query';
import { useUpdateOrganizationMutation } from '../hooks/use-update-organization-mutation';

export const OrganizationsListContainer = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [filterInfo, setFilterInfo] = useState<Filters<IOrganization>>({});
  const [sorterInfo, setSorterInfo] = useState<Sorter<IOrganization>>({});
  const [modal, contextHolder] = Modal.useModal();

  const { queryState, setQueryState } = useQueryState();

  const hasValidPagination = currentPage > 0 && pageSize > 0;

  const { data, isLoading } = useOrganizationsQuery(
    currentPage - 1,
    pageSize,
    filterInfo,
    sorterInfo,
    hasValidPagination,
  );

  const organizations = (data?.data ?? []).map((organization: IOrganization) => ({
    ...organization,
    key: organization.id,
  }));
  const totalRecords = data?.total ?? 0;

  const updateOrgMutation = useUpdateOrganizationMutation();

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

  const handleFiltersChange = (filters: Filters<IOrganization>) => {
    setFilterInfo(filters);
    handlePageChange(1, pageSize);
  };

  const handleSorterChange = (sorter: Sorter<IOrganization>) => {
    setSorterInfo(sorter);
    handlePageChange(1, pageSize);
  };

  const confirm = (id: string, name: string) => {
    modal.confirm({
      closable: true,
      title: 'Deactivating the organization',
      icon: <WarningOutlined style={{ color: '#E04149' }} />,
      content: (
        <Text>
          Deactivating this organization (
          <Text style={{ color: '#3D71FB' }}>{name}</Text>) will immediately
          revoke their access and permissions associated with the it. Do you
          want to proceed?
        </Text>
      ),
      okText: 'Deactivate',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: () => {
        updateOrgMutation.mutate({
          data: { status: 'INACTIVE' },
          organizationId: id,
        });
      },
    });
  };

  const toggleStatus = (organization: IOrganization) => {
    const status = organization.status?.name;
    if (status === 'INACTIVE') {
      updateOrgMutation.mutate({
        data: { status: 'ACTIVE' },
        organizationId: organization.id as string,
      });
    } else {
      confirm(organization.id as string, organization.name);
    }
  };

  if (isLoading && !data) return <ScreenLoader />;

  return (
    <>
      <TableWithPaginationLayout
        header={
          <OrganizationsListHeader
            filterInfo={filterInfo}
            onFiltersChange={handleFiltersChange}
          />
        }
        table={
          <OrganizationList
            organizations={organizations}
            toggleStatus={toggleStatus}
            filterInfo={filterInfo}
            sorterInfo={sorterInfo}
            handleFiltersChange={handleFiltersChange}
            handleSorterChange={handleSorterChange}
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
