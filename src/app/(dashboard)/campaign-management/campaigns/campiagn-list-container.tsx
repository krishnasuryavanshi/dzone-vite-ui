
import { Hideable, TableWithPaginationLayout } from '@/components/shared';
import { ScreenLoader } from '@/components/shared/loader';
import { useQueryState } from '@/lib/hooks';
import { hasActiveFilters } from '@/lib/utils';
import { Filters } from '@/lib/utils/table';
import { SimplePagination } from '@/uicomponents';
import { FC, useEffect, useState } from 'react';
import { CammpainFilters } from './campaign-filters';
import { CampaignList } from './campaign-list';
import { ICampaign } from './lib/types';
import { useCampaignsQuery } from './hooks';
import { useCampaignListStore } from './store/use-campaign-list-store';

interface ICampaignListContainerProps {
  isDzoneUser?: boolean;
}

export const CampaignListContainer: FC<ICampaignListContainerProps> = ({
  isDzoneUser,
}) => {
  const { queryState, setQueryState } = useQueryState();
  const [filterInfo, setFilterInfo] = useState<Filters<ICampaign>>({});
  const [assignedTo, setAssignedTo] = useState('all');

  // Derive page/size from URL query state
  const pageNo = Number(queryState?.page) || 0;
  const size = Number(queryState?.pageSize) || 0;

  // Set default pagination if not in URL
  useEffect(() => {
    if (queryState && (!pageNo || !size)) {
      setQueryState([
        { name: 'page', value: pageNo || 1 },
        { name: 'pageSize', value: size || 25 },
      ]);
    }
  }, [queryState]);

  // TanStack Query replaces manual fetchData + useState for list/total/page
  const { data, isLoading } = useCampaignsQuery(
    pageNo - 1,
    size,
    filterInfo,
    pageNo > 0 && size > 0,
  );

  // Keep store for validation overlay loading triggered by row actions
  const isValidating = useCampaignListStore((s) => s.isLoading);

  const campaignList = data?.data ?? [];
  const totalRecords = data?.total ?? 0;

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryState([
      { name: 'page', value: page },
      { name: 'pageSize', value: pageSize },
    ]);
  };

  const goToFirstPage = () => {
    setQueryState([{ name: 'page', value: 0 }]);
  };

  const clearFilters = () => {
    setAssignedTo('all');
    setFilterInfo({});
    if (Object.values(filterInfo).filter((value) => value).length) {
      goToFirstPage();
    }
  };

  const handleFiltersChange = (filters: Filters<ICampaign>) => {
    setFilterInfo(filters);
    goToFirstPage();
  };

  const handleAssignedToFilterChange = (assignedTo: string) => {
    setAssignedTo(assignedTo);
    if (assignedTo === 'all') {
      handleFiltersChange({ ...filterInfo, assignedTo: null });
    } else {
      handleFiltersChange({
        ...filterInfo,
        assignedTo: [assignedTo],
      });
    }
  };

  if (isLoading || isValidating) return <ScreenLoader />;

  return (
    <TableWithPaginationLayout
        header={
          <CammpainFilters
            clearFilters={clearFilters}
            isSearchDisabled={true}
            isRefreshDisabled={true}
            isDownloadDisabled={true}
            handleAssignedToFilterChange={handleAssignedToFilterChange}
            assignedToFilterSelectedValue={assignedTo}
            hasActiveFilters={hasActiveFilters(filterInfo)}
          />
        }
        table={
          <CampaignList
            campaigns={campaignList}
            filterInfo={filterInfo}
            handleFiltersChange={handleFiltersChange}
            assignedTo={assignedTo}
            isDzoneUser={isDzoneUser}
            hasFilters
          />
        }
        pagination={
          <Hideable show={totalRecords > 0}>
            <SimplePagination
              current={pageNo}
              pageSize={size}
              total={totalRecords}
              onChange={handlePageChange}
            />
          </Hideable>
        }
      />
  );
};
