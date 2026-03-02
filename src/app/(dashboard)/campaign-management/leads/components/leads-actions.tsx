'use client';
import { HasPermission } from '@/components/auth';
import { Translate } from '@/components/i18n';
import { Hideable } from '@/components/shared/hideable';
import { LeadActionsEnum } from '@/lib/enums/permissions';
import { Button, Tooltip } from '@/uicomponents';
import {
  DownloadOutlined,
  FilterFilled,
  LoadingOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';

interface ILeadsActionsProps {
  onExport: () => void;
  onClearFilters: () => void;
  isExporting: boolean;
  isSearchDisabled: boolean;
  isFilterDisabled: boolean;
  isRefreshDisabled: boolean;
  hasActiveFilters?: boolean;
}

export const LeadsActions: FC<ILeadsActionsProps> = ({
  onExport,
  onClearFilters,
  isExporting,
  isFilterDisabled,
  isRefreshDisabled,
  isSearchDisabled,
  hasActiveFilters = false,
}) => {
  return (
    <Flex gap={'0.75rem'}>
      <Hideable show={hasActiveFilters}>
        <Tooltip title={<Translate i18nKey='pages.clearFilters' />}>
          <Button className='dz-btn-action-1' onClick={onClearFilters}>
            <Translate i18nKey='Clear Filters' />
          </Button>
        </Tooltip>
      </Hideable>
      {/* Commenting this out for now, this will be used in the future */}
      {/* <Button
        icon={<SearchOutlined />}
        className='dz-btn-action-1'
        disabled={isSearchDisabled}
      />
      <Button
        icon={<FilterFilled />}
        className='dz-btn-action-1'
        disabled={isFilterDisabled}
      /> */}
      <HasPermission permissions={LeadActionsEnum.DownloadLead}>
        <Button
          onClick={onExport}
          icon={isExporting ? <LoadingOutlined /> : <DownloadOutlined />}
          className='dz-btn-action-1'
          disabled={isExporting}
        />
      </HasPermission>
      {/* Commenting this out for now, this will be used in the future */}
      {/* <Button
        icon={<ReloadOutlined />}
        className='dz-btn-action-1'
        disabled={isRefreshDisabled}
      /> */}
    </Flex>
  );
};
