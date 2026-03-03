
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
import { fetchCampaigns } from './services';
import { useCampaignListStore } from './store/use-campaign-list-store';

interface ICampaignListContainerProps {
  isDzoneUser?: boolean;
}

export const CampaignListContainer: FC<ICampaignListContainerProps> = ({
  isDzoneUser,
}) => {
  const [campaignList, setCampaignList] = useState<ICampaign[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const { isLoading, showLoader } = useCampaignListStore();
  const { queryState, setQueryState } = useQueryState();
  const [filterInfo, setFilterInfo] = useState<Filters<ICampaign>>({});

  const [isSearchDisabled, setIsSearchDisabled] = useState<boolean>(false);
  const [isRefreshDisabled, setIsRefreshDisabled] = useState<boolean>(false);
  const [isDownloadDisabled, setIsDownloadDisabled] = useState<boolean>(false);

  const [assignedTo, setAssignedTo] = useState('all');

  useEffect(() => {
    setIsDownloadDisabled(true);
    setIsRefreshDisabled(true);
    setIsSearchDisabled(true);
  }, []);

  useEffect(() => {
    if (queryState) {
      let { page, pageSize } = queryState;
      const pageNo = Number(page);
      const size = Number(pageSize);
      if (pageNo && size) {
        setCurrentPage(pageNo);
        setPageSize(size);
        fetchData(pageNo, size);
      } else {
        setQueryState([
          { name: 'page', value: pageNo || 1 },
          { name: 'pageSize', value: size || 25 },
        ]);
      }
    }
  }, [queryState]);

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryState([
      { name: 'page', value: page },
      { name: 'pageSize', value: pageSize },
    ]);
  };

  const goToFirstPage = () => {
    setQueryState([{ name: 'page', value: 0 }]);
  };

  const fetchData = async (page: number, size: number) => {
    const data = await fetchCampaigns(page - 1, size, filterInfo);
    setTotalRecords(data?.total);
    setCampaignList(data?.data);
  };

  const clearFilters = () => {
    setAssignedTo('all');
    setFilterInfo({});
    // reading old state
    if (Object.values(filterInfo).filter((value) => value).length) {
      goToFirstPage();
    }
  };

  const handleFiltersChange = (filters: Filters<ICampaign>) => {
    setFilterInfo(filters);
    goToFirstPage();
  };

  const handleAssignedToFilterChange = (assignedTo: string) => {
    setAssignedTo(assignedTo); // all or userId
    if (assignedTo === 'all') {
      handleFiltersChange({ ...filterInfo, assignedTo: null });
    } else {
      handleFiltersChange({
        ...filterInfo,
        assignedTo: [assignedTo],
      });
    }
  };

  if (isLoading) return <ScreenLoader />;

  return (
    <TableWithPaginationLayout
        header={
          <CammpainFilters
            clearFilters={clearFilters}
            isSearchDisabled={isSearchDisabled}
            isRefreshDisabled={isRefreshDisabled}
            isDownloadDisabled={isDownloadDisabled}
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
              current={currentPage}
              pageSize={pageSize}
              total={totalRecords}
              onChange={handlePageChange}
            />
          </Hideable>
        }
      />
  );
};
