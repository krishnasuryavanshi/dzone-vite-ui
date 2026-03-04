import React, { FC, useMemo, useState } from 'react';
import { ILeadStatus } from '../../leads/lib/types';
import { DzRadioDropdown } from '@/components/shared/custom/dz-radio-dropdown';
import { leadsStatusUpdate } from '../services';
import { showNotification } from '@/services/notification';
import { useLeadsStore } from '../store';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { useLeadStatusesQuery } from '../hooks';

interface IBulkStatusUpdateDropdownProps {
  disabled?: boolean;
  leadIds?: number[];
  tenantCode?: string;
  lineItemId?: string;
  filteredInfo?: Record<string, any>;
}

interface Option {
  label: string;
  value: string;
}

export const BulkStatusUpdateDropdown: FC<IBulkStatusUpdateDropdownProps> = ({
  disabled,
  leadIds,
  tenantCode,
  lineItemId,
  filteredInfo,
}) => {
  const setSelectedIds = useLeadsStore((state) => state.setSelectedIds);
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const { data: statusData } = useLeadStatusesQuery();

  const options = useMemo<Option[]>(() => {
    if (!statusData?.data) return [];
    return statusData.data
      .filter((item: ILeadStatus) => item.name !== 'Published')
      .map((item: ILeadStatus) => ({
        value: item.name,
        label: item.value,
      }));
  }, [statusData]);

  const handleStatusChange = async (value: string) => {
    setSelected(value);
    setLoading(true);
    if (leadIds && leadIds.length > 0) {
      await handleBulkStatusUpdate(value, leadIds);
      setSelected(undefined);
    }
    setLoading(false);
  };

  const handleBulkStatusUpdate = async (status: string, leadIds: number[]) => {
    if (!tenantCode || !leadIds.length || !lineItemId) return;
    const leadUpdates = leadIds.map((id) => ({
      id,
      leadStatus: status,
    }));
    try {
      const response = await leadsStatusUpdate(leadUpdates, tenantCode);
      if (response) {
        // Invalidate leads queries to trigger refetch
        queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
        setSelectedIds([]);
        showNotification({ message: response.message });
      }
    } catch (e) {}
  };

  return (
    <DzRadioDropdown
      label='Status Update'
      options={options}
      onStatusChange={handleStatusChange}
      disabled={disabled || loading}
      selected={selected}
      style={{
        height: '2rem',
      }}
    />
  );
};
