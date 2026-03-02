import { HasPermission } from '@/components/auth';
import { Translate } from '@/components/i18n';
import { Hideable } from '@/components/shared/hideable';
import { LeadActionsEnum } from '@/lib/enums/permissions';
import { usePermissionCheck } from '@/lib/hooks';
import { hasActiveFilters } from '@/lib/utils';
import { Filters } from '@/lib/utils/table';
import { Button, Tooltip } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { isEmpty } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { ILead } from '../../../leads/lib/types';
import { LeadStatusFileType } from '../../lib/enums';
import { useLeadsStore } from '../../store';
import { LeadStatusDropdown } from '../lead-status-dropdown';
import { LeadsFiltersManager } from './leads-filters-manager';
import { LeadsGridContainer } from './leads-grid-container';
import { LeadsHeader } from './leads-header';
import { LeadsPagination } from './leads-pagination';
import { Refresh } from './refresh';
import { ValidationStatusDropdown } from './validation-status-dropdown';
import { useLeadsCountStore } from '../../../leads/store';

interface IShowLeadsProps {
  lineItemId: string;
  show: boolean;
  tenantCode?: string;
}

export const ShowLeads: FC<IShowLeadsProps> = ({
  lineItemId,
  show,
  tenantCode,
}) => {
  const setSelectedIds = useLeadsStore((state) => state.setSelectedIds);
  const leadsData = useLeadsStore((state) => state.leadsData);
  const updateLeadsData = useLeadsStore((state) => state.updateLeadsData);
  const resetLeadsData = useLeadsStore((state) => state.resetLeadsData);
  const fetchLeadsFromStore = useLeadsStore((state) => state.fetchLeads);
  const totalFilteredLeads = useLeadsStore((state) => state.totalFilteredLeads);
  const allowMultiselect = usePermissionCheck([
    LeadActionsEnum.ReturnLeads,
    LeadActionsEnum.PublishLead,
    LeadActionsEnum.StatusUpdate,
    LeadActionsEnum.ArchiveLead,
  ]);
  const setStoreLeadsCount = useLeadsCountStore((state) => state.setTotalLeads);

  const [filteredInfo, setFilteredInfo] = useState<Filters<ILead>>({});
  const setLeadsList = useLeadsStore((state) => state.setLeadsList);

  const fetchLeads = () => {
    if (tenantCode) {
      fetchLeadsFromStore(
        tenantCode,
        lineItemId,
        filteredInfo,
        setStoreLeadsCount,
      );
    }
  };

  // Clear leads when lineItemId changes
  useEffect(() => {
    // Clear the leads list immediately when lineItemId changes
    setLeadsList([]);
    setSelectedIds([]);
    resetLeadsData();

    if (!tenantCode || !lineItemId) return;
    fetchLeads();
  }, [lineItemId]);

  // Fetch leads when filters change
  useEffect(() => {
    if (!tenantCode || !lineItemId) return;
    fetchLeads();
  }, [tenantCode, filteredInfo]);

  // Trigger fetch when leads data changes (pagination, status filters, sorting)
  useEffect(() => {
    if (!tenantCode || !lineItemId) return;
    fetchLeads();
  }, [
    leadsData.currentPage,
    leadsData.pageSize,
    leadsData.selectedLeadsStatus,
    leadsData.selectedValidationStatus,
    leadsData.sortBy,
    leadsData.sortOrder,
  ]);

  const handleLeadsStatusChange = (data: string[]) => {
    updateLeadsData({ selectedLeadsStatus: data });
  };

  const handleValidationStatusChange = (data: string[]) => {
    updateLeadsData({ selectedValidationStatus: data });
  };

  const handlePaginationChange = (page: number, size: number) => {
    updateLeadsData({ currentPage: page, pageSize: size });
  };

  const goToFirstPage = () => {
    updateLeadsData({ currentPage: 1 });
  };

  const refreshLeadsList = () => {
    if (leadsData.currentPage === 1) {
      fetchLeads();
    } else {
      goToFirstPage();
    }
  };

  const handleSelectionChange = (selectedLeads: number[]) => {
    setSelectedIds(selectedLeads);
  };

  const handleFiltersChange = (filters: Record<string, any> = {}) => {
    // Extract sorting from filters if present
    const { sortBy, sortOrder, ...actualFilters } = filters;

    setFilteredInfo(actualFilters);

    // Handle sorting if present
    if (sortBy && sortOrder) {
      updateLeadsData({
        sortBy: sortBy[0],
        sortOrder: sortOrder[0] as 'asc' | 'desc',
        currentPage: 1, // Reset to first page on sort change
      });
    } else if (
      !sortBy &&
      !sortOrder &&
      (leadsData.sortBy || leadsData.sortOrder)
    ) {
      // Clear sorting if it was removed
      updateLeadsData({
        sortBy: null,
        sortOrder: null,
        currentPage: 1,
      });
    } else {
      goToFirstPage();
    }
  };

  const handleClearFilters = () => {
    if (!isEmpty(filteredInfo)) {
      handleFiltersChange({});
    }
  };

  const refresh = () => {
    resetLeadsData();
    // Force re-fetch after reset
    fetchLeads();
  };

  if (!show) {
    return null;
  }

  return (
    <>
      <Flex vertical gap={'0.5rem'}>
        <LeadsHeader
          lineItemId={lineItemId}
          totalFilteredLeads={totalFilteredLeads}
          leadStatus={leadsData.selectedLeadsStatus}
          validationStatus={leadsData.selectedValidationStatus}
          refreshLeadsList={refreshLeadsList}
          tenantCode={tenantCode}
        />
        <LeadsFiltersManager>
          <Flex gap={'0.5rem'}>
            <LeadStatusDropdown
              onLeadsStatusChange={handleLeadsStatusChange}
              selected={leadsData.selectedLeadsStatus}
              isFileType={LeadStatusFileType.Leads}
            />
            <HasPermission permissions={[LeadActionsEnum.ValidationFilter]}>
              <ValidationStatusDropdown
                onValidationStatusChange={handleValidationStatusChange}
                selected={leadsData.selectedValidationStatus}
                isFileType={LeadStatusFileType.Leads}
              />
            </HasPermission>
            <Refresh onRefresh={refresh} />
            <Hideable show={hasActiveFilters(filteredInfo)}>
              <Tooltip title={<Translate i18nKey='pages.clearFilters' />}>
                <Button
                  onClick={handleClearFilters}
                  style={{
                    height: '2.25rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}>
                  <Translate i18nKey='Clear Filters' />
                </Button>
              </Tooltip>
            </Hideable>
          </Flex>
        </LeadsFiltersManager>
        <LeadsGridContainer
          isSelectable={allowMultiselect}
          onSelectionChange={handleSelectionChange}
          lineItemId={lineItemId}
          leadStatuses={leadsData.selectedLeadsStatus}
          validationStatuses={leadsData.selectedValidationStatus}
          refreshLeadsList={refreshLeadsList}
          tenantCode={tenantCode}
          filteredInfo={filteredInfo}
          onFiltersChange={handleFiltersChange}
        />
      </Flex>
      <Hideable show={totalFilteredLeads > 0}>
        <LeadsPagination
          currentPage={leadsData.currentPage}
          totalRecords={totalFilteredLeads}
          pageSize={leadsData.pageSize}
          handlePaginationChange={handlePaginationChange}
        />
      </Hideable>
    </>
  );
};
