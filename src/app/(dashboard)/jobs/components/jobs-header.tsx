'use client';

import { hasActiveFilters } from '@/lib/utils';
import { Filters } from '@/lib/utils/table';
import { Button } from '@/uicomponents/button';
import { Flex } from '@/uicomponents/layout';
import { Title } from '@/uicomponents/title';
import { FC } from 'react';
import { IJob } from '../lib/types';
import { Hideable } from '@/components/shared';

interface JobsHeaderProps {
  filterInfo?: Filters<IJob>;
  onFiltersChange?: (filters: Filters<IJob>) => void;
  showHeader?: boolean;
}

export const JobsHeader: FC<JobsHeaderProps> = ({
  filterInfo,
  onFiltersChange,
  showHeader = true,
}) => {
  const showClearFilters = hasActiveFilters(filterInfo ?? {});

  // Don't render the header at all if title is hidden and no filters are active
  if (!showHeader && !showClearFilters) {
    return null;
  }

  return (
    <Flex
      gap='0.75rem'
      justify={showHeader ? 'space-between' : 'end'}
      align='center'>
      <Hideable show={showHeader}>
        <Title level={4} style={{ margin: 0 }}>
          Jobs
        </Title>
      </Hideable>
      <Button
        onClick={() => onFiltersChange?.({})}
        style={{ visibility: showClearFilters ? 'visible' : 'hidden' }}>
        Clear Filters
      </Button>
    </Flex>
  );
};
