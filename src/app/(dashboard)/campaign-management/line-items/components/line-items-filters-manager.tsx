'use client';
import { Flex } from '@/uicomponents/layout';
import React, { FC } from 'react';
import { LineItemsActions } from './line-items-actions';
import { Translate } from '@/components/i18n';
import { CLR_BLACK } from '@/lib/constants';
import { Text } from '@/uicomponents/text';
import { useSession } from 'next-auth/react';

interface ILineItemsFiltersProps {
  clearFilters: () => void;
  isSearchDisabled: boolean;
  isRefreshDisabled: boolean;
  isDownloadDisabled: boolean;
  assignedToFilterSelectedValue: string;
  handleAssignedToFilterChange: (assignedTo: string) => void;
  hasActiveFilters?: boolean;
}

export const LineItemsFiltersManager: FC<ILineItemsFiltersProps> = ({
  clearFilters,
  isDownloadDisabled,
  isRefreshDisabled,
  isSearchDisabled,
  assignedToFilterSelectedValue,
  handleAssignedToFilterChange,
  hasActiveFilters = false,
}) => {
  const data = useSession();
  return (
    <Flex gap='0.75rem' align='center' justify='space-between'>
      <Text style={{ color: CLR_BLACK, fontWeight: 600, fontSize: '1.125rem' }}>
        <Translate i18nKey='Line Items' />
      </Text>

      <Flex align='center' gap='0.75rem'>
        <LineItemsActions
          clearFilters={clearFilters}
          isSearchDisabled={isSearchDisabled}
          isRefreshDisabled={isRefreshDisabled}
          isDownloadDisabled={isDownloadDisabled}
          assignedToFilterSelectedValue={assignedToFilterSelectedValue}
          handleAssignedToFilterChange={handleAssignedToFilterChange}
          hasActiveFilters={hasActiveFilters}
        />
      </Flex>
    </Flex>
  );
};
