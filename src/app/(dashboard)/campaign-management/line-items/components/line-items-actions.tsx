'use client';
import { Translate } from '@/components/i18n';
import { Hideable } from '@/components/shared/hideable';
import { MenuProps } from '@/lib/types/uicomponents';
import { Button, Text, Tooltip } from '@/uicomponents';
import {
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { FC, useEffect } from 'react';
import { FilterDropdownAssignedUser } from '../../components';
import { useSession } from 'next-auth/react';
import {
  LineItemActionsEnum,
  ViewLineItemPermissions,
} from '@/lib/enums/permissions';
import { usePermissionCheck } from '@/lib/hooks';
import { HasPermission } from '@/components/auth';
import Link from 'next/link';
import { CLR_BLACK, DZONE_CLR_BLACK, DZONE_CLR_GRAY_2 } from '@/lib/constants';

interface ILineItemsActionsProps {
  clearFilters: () => void;
  isSearchDisabled: boolean;
  isRefreshDisabled: boolean;
  isDownloadDisabled: boolean;
  assignedToFilterSelectedValue: string;
  handleAssignedToFilterChange: (assignedTo: string) => void;
  hasActiveFilters?: boolean;
}

export const LineItemsActions: FC<ILineItemsActionsProps> = ({
  clearFilters,
  isDownloadDisabled,
  isRefreshDisabled,
  isSearchDisabled,
  assignedToFilterSelectedValue,
  handleAssignedToFilterChange,
  hasActiveFilters = false,
}) => {
  const user = useSession();
  const isAssignedToAll = usePermissionCheck(
    ViewLineItemPermissions.AllLineItems,
  );
  const isAssignedToMe = usePermissionCheck(
    ViewLineItemPermissions.LineItemsAssignedToMe,
  );

  useEffect(() => {
    if (isAssignedToMe && !isAssignedToAll) {
      handleAssignedToFilterChange(
        (user?.data?.user as { userId: string })?.userId,
      );
    }
  }, [isAssignedToMe, isAssignedToAll]);

  const handleAssigneToOptionChange = (assignedTo: string) => {
    if (assignedTo === 'me') {
      handleAssignedToFilterChange(
        (user?.data?.user as { userId: string })?.userId,
      );
      return;
    }
    handleAssignedToFilterChange(assignedTo);
  };

  const items: MenuProps['items'] = [
    isAssignedToAll && {
      label: (
        <Text>
          <Translate i18nKey='pages.lineItems.label.viewAll' />
        </Text>
      ),
      key: 'all',
      onClick: () => handleAssigneToOptionChange('all'),
    },
    isAssignedToMe && {
      label: (
        <Text>
          <Translate i18nKey='pages.lineItems.label.viewOnlyAssignedToMe' />
        </Text>
      ),
      key: 'me',
      onClick: () => handleAssigneToOptionChange('me'),
    },
  ].filter(Boolean) as MenuProps['items'];

  return (
    <Flex gap={'0.75rem'}>
      <Hideable show={hasActiveFilters}>
        <Tooltip title={<Translate i18nKey='pages.clearFilters' />}>
          <Button className='dz-btn-action-1' onClick={clearFilters}>
            <Translate i18nKey='Clear Filters' />
          </Button>
        </Tooltip>
      </Hideable>
      {/* Commenting this out for now, this will be used in the future */}
      {/* <Button
        icon={<SearchOutlined />}
        className='dz-btn-action-1'
        disabled={isSearchDisabled}
      /> */}
      <FilterDropdownAssignedUser
        items={items}
        assignedToFilterSelectedValue={assignedToFilterSelectedValue}
      />
      {/* Commenting this out for now, this will be used in the future */}
      {/* <Button
        icon={<DownloadOutlined />}
        className='dz-btn-action-1'
        disabled={isDownloadDisabled}
      />
      <Button
        icon={<ReloadOutlined />}
        className='dz-btn-action-1'
        disabled={isRefreshDisabled}
      /> */}
      <Flex gap='0.75rem' align='center'>
        <HasPermission permissions={LineItemActionsEnum.Create}>
          <Link href='/campaign-management/line-items/create'>
            <Button
              style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '0.3125rem',
                background:
                  'linear-gradient(white, white) padding-box, linear-gradient(109deg, #FFB8EC 4.89%, #F3D6FF 51.39%, #7D88FF 97.01%) border-box',
                border: '1.5px solid transparent',
                height: '2.25rem',
                color: DZONE_CLR_BLACK,
              }}>
              <Translate i18nKey='pages.lineItems.label.newLineItem' />
            </Button>
          </Link>
        </HasPermission>
      </Flex>
    </Flex>
  );
};
