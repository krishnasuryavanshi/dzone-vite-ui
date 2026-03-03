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
import { FC, useEffect, useMemo, useState } from 'react';
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
import { useLeadsListQuery } from '../../../leads/hooks/use-leads-list-query';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';

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
  const allowMultiselect = usePermissionCheck([
    LeadActionsEnum.ReturnLeads,
    LeadActionsEnum.PublishLead,
    LeadActionsEnum.StatusUpdate,
    LeadActionsEnum.ArchiveLead,
  ]);
  const setStoreLeadsCount = useLeadsCountStore((state) => state.setTotalLeads);
  const queryClient = useQueryClient();

  const setLeadsList = useLeadsStore((state) => state.setLeadsList);
  const [filteredInfo, setFilteredInfo] = useState<Filters<ILead>>({});

  // Build extraParams from store leadsData + filteredInfo
  const extraParams = useMemo(() => {
    const params: Record<string, any> = {};

    // Add lead status filter
    if (leadsData.selectedLeadsStatus.length > 0) {
      params.leadStatus = leadsData.selectedLeadsStatus.toString();
    }

    // Add validation status filter
    if (leadsData.selectedValidationStatus.length > 0) {
      params.leadValidationStatus = leadsData.selectedValidationStatus.toString();
    }

    // Add filteredInfo to params
    if (filteredInfo && Object.keys(filteredInfo).length) {
      Object.keys(filteredInfo).forEach((key) => {
        const values = filteredInfo[key] ?? [];
        if (values[0]) {
          if (
            typeof values[0] === 'object' &&
            values[0] !== null &&
            ('from' in values[0] || 'to' in values[0])
          ) {
            const dateRange = values[0] as { from?: string; to?: string };
            if (dateRange.from) params[`${key}From`] = dateRange.from;
            if (dateRange.to) params[`${key}To`] = dateRange.to;
          } else {
            params[key] = values[0];
          }
        }
      });
    }

    // Add sorting parameters
    if (leadsData.sortBy) {
      params.sortBy = leadsData.sortBy;
    }
    if (leadsData.sortOrder) {
      params.sortOrder = leadsData.sortOrder;
    }

    return params;
  }, [
    leadsData.selectedLeadsStatus,
    leadsData.selectedValidationStatus,
    leadsData.sortBy,
    leadsData.sortOrder,
    filteredInfo,
  ]);

  const { data } = useLeadsListQuery(
    leadsData.currentPage - 1,
    leadsData.pageSize,
    tenantCode,
    lineItemId,
    extraParams,
    !!lineItemId && !!tenantCode && show,
  );

  const leadsList = data?.data ?? [];
  const totalFilteredLeads = data?.total ?? 0;

  // Sync leads list to store for child components
  useEffect(() => {
    setLeadsList(leadsList);
  }, [leadsList]);

  // Update leads count store when total changes
  useEffect(() => {
    if (data?.total !== undefined) {
      setStoreLeadsCount(data.total);
    }
  }, [data?.total]);

  // Clear leads when lineItemId changes
  useEffect(() => {
    setSelectedIds([]);
    resetLeadsData();
  }, [lineItemId]);

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
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
    } else {
      goToFirstPage();
    }
  };

  const handleSelectionChange = (selectedLeads: number[]) => {
    setSelectedIds(selectedLeads);
  };

  const handleFiltersChange = (filters: Record<string, any> = {}) => {
    const { sortBy, sortOrder, ...actualFilters } = filters;

    setFilteredInfo(actualFilters);

    if (sortBy && sortOrder) {
      updateLeadsData({
        sortBy: sortBy[0],
        sortOrder: sortOrder[0] as 'asc' | 'desc',
        currentPage: 1,
      });
    } else if (
      !sortBy &&
      !sortOrder &&
      (leadsData.sortBy || leadsData.sortOrder)
    ) {
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
    queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
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
