import { Hideable, TableWithPaginationLayout } from '@/components/shared';
import { ScreenLoader } from '@/components/shared/loader';
import { useQueryState } from '@/lib/hooks';
import { showNotification } from '@/services/index';
import { SimplePagination } from '@/uicomponents';
import { WarningOutlined } from '@/uicomponents/icons';
import { Modal } from '@/uicomponents/modal';
import { Text } from '@/uicomponents/text';
import { useEffect, useRef, useState } from 'react';
import { IOrganization } from '../lib/types';
import { fetchOrganizations, updateOrganization } from '../services';
import { Filters, Sorter } from '@/lib/utils/table';
import { OrganizationList } from './organization-list';
import { OrganizationsListHeader } from './organizations-list-header';

export const OrganizationsListContainer = () => {
  const [organizations, setOrganizations] = useState<IOrganization[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterInfo, setFilterInfo] = useState<Filters<IOrganization>>({});
  const [sorterInfo, setSorterInfo] = useState<Sorter<IOrganization>>({});
  const [modal, contextHolder] = Modal.useModal();
  const filterInfoRef = useRef(filterInfo);
  const sorterInfoRef = useRef(sorterInfo);

  const { queryState, setQueryState } = useQueryState();

  useEffect(() => {
    if (queryState) {
      let { page, pageSize, roleId } = queryState;
      const pageNo = Number(page);
      const size = Number(pageSize);

      if (pageNo && size) {
        setCurrentPage(pageNo);
        setPageSize(size);
        fetchOrganizationList(pageNo, size);
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

  const isInitialMount = useRef(true);

  const handleFiltersChange = (filters: Filters<IOrganization>) => {
    setFilterInfo(filters);
    filterInfoRef.current = filters;
  };

  const handleSorterChange = (sorter: Sorter<IOrganization>) => {
    setSorterInfo(sorter);
    sorterInfoRef.current = sorter;
  };

  // Re-fetch when filters or sorter change
  useEffect(() => {
    // Skip initial mount - queryState useEffect handles initial fetch
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (pageSize) {
      fetchOrganizationList(1, pageSize);
      setCurrentPage(1);
      setQueryState([
        { name: 'page', value: 1 },
        { name: 'pageSize', value: pageSize },
      ]);
    }
  }, [filterInfo, sorterInfo]);

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
        updateOrganizationStatus({ id } as IOrganization, 'INACTIVE');
      },
    });
  };

  const fetchOrganizationList = async (
    currentPage: number,
    pageSize: number,
  ) => {
    // setIsLoading(true);
    const { data, total } = await fetchOrganizations(
      currentPage - 1,
      pageSize,
      filterInfoRef.current,
      sorterInfoRef.current,
    );
    setOrganizations(
      data.map((organization: IOrganization) => ({
        ...organization,
        key: organization.id,
      })),
    );
    setTotalRecords(total);
    // setIsLoading(false);
  };

  const toggleStatus = (organization: IOrganization) => {
    const status = organization.status?.name;
    try {
      if (status === 'INACTIVE') {
        updateOrganizationStatus(organization, 'ACTIVE');
      } else {
        confirm(organization.id as string, organization.name);
      }
    } catch (error) {}
  };

  const updateOrganizationStatus = async (
    organization: IOrganization,
    status: string,
  ) => {
    try {
      const data = await updateOrganization(
        { status },
        organization.id as string,
      );
      showNotification({
        type: 'success',
        message: data?.message,
      });
      handleRefreshList(data?.data);
    } catch (error) {}
  };

  const handleRefreshList = (organization: IOrganization) => {
    const organizationsList = [...organizations];
    const index = organizationsList.findIndex(
      (org) => org.id === organization.id,
    );
    if (index !== -1) {
      organizationsList[index] = {
        ...organizationsList[index],
        ...organization,
      };
    }
    setOrganizations(organizationsList);
  };

  if (isLoading) return <ScreenLoader />;

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
