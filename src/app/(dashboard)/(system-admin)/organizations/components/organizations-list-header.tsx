import { Translate } from '@/components/i18n';
import { Hideable } from '@/components/shared/hideable';
import { hasActiveFilters } from '@/lib/utils';
import { Filters } from '@/lib/utils/table';
import { Button } from '@/uicomponents/button';
import { Flex } from '@/uicomponents/layout';
import { Tooltip } from '@/uicomponents/tooltip';
import { FC } from 'react';
import { IOrganization } from '../lib/types';
import { CreateNewOrganizationAction } from './create-new-organization-action';
import { OrganizationsTitle } from './organizations-title';

interface IOrganizationsListHeaderProps {
  filterInfo?: Filters<IOrganization>;
  onFiltersChange?: (filters: Filters<IOrganization>) => void;
}

export const OrganizationsListHeader: FC<IOrganizationsListHeaderProps> = ({
  filterInfo,
  onFiltersChange,
}) => {
  return (
    <Flex gap='0.75rem' justify='space-between' align='center'>
      <OrganizationsTitle />
      <Flex gap='0.75rem' justify='space-between'>
        <Hideable show={hasActiveFilters(filterInfo ?? {})}>
          <Tooltip title={<Translate i18nKey='pages.clearFilters' />}>
            <Button onClick={() => onFiltersChange?.({})}>
              <Translate i18nKey='Clear Filters' />
            </Button>
          </Tooltip>
        </Hideable>
        <CreateNewOrganizationAction />
      </Flex>
    </Flex>
  );
};
