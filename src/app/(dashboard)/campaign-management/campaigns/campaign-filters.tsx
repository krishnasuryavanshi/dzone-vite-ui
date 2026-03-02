import { Translate } from '@/components/i18n';
import { Hideable } from '@/components/shared/hideable';
import { Button, Text, Tooltip } from '@/uicomponents';
import {
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { FC, useEffect } from 'react';
import { MenuProps } from '@/lib/types/uicomponents';
import { FilterDropdownAssignedUser } from '../components';
import { useSession } from 'next-auth/react';
import { HasPermission } from '@/components/auth';
import {
  CampaignActionsEnum,
  ViewCampaignPermissions,
} from '@/lib/enums/permissions';
import { usePermissionCheck } from '@/lib/hooks';
import { CLR_BLACK, DZONE_CLR_BLACK, DZONE_CLR_GRAY_2 } from '@/lib/constants';
import Link from 'next/link';

interface ICammpainFiltersProps {
  handleAssignedToFilterChange: (assignedTo: string) => void;
  clearFilters?: () => void;
  isSearchDisabled: boolean;
  isRefreshDisabled: boolean;
  isDownloadDisabled: boolean;
  assignedToFilterSelectedValue: string;
  hasActiveFilters?: boolean;
}

export const CammpainFilters: FC<ICammpainFiltersProps> = ({
  clearFilters,
  isDownloadDisabled,
  isRefreshDisabled,
  isSearchDisabled,
  handleAssignedToFilterChange,
  assignedToFilterSelectedValue,
  hasActiveFilters = false,
}) => {
  const user = useSession();

  const isAssignedToAll = usePermissionCheck(
    ViewCampaignPermissions.AllCampaigns,
  );
  const isAssignedToMe = usePermissionCheck(
    ViewCampaignPermissions.CampaignsAssignedToMe,
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
          <Translate i18nKey='pages.campaigns.label.viewAll' />
        </Text>
      ),
      key: 'all',
      onClick: () => handleAssigneToOptionChange('all'),
    },
    isAssignedToMe && {
      label: (
        <Text>
          <Translate i18nKey='pages.campaigns.label.viewOnlyAssignedToMe' />
        </Text>
      ),
      key: 'me',
      onClick: () => handleAssigneToOptionChange('me'),
    },
  ].filter(Boolean) as MenuProps['items'];

  const isCreateCampaignAllowed = usePermissionCheck(
    CampaignActionsEnum.Create,
  );

  return (
    <Flex
      gap='0.75rem'
      justify={isCreateCampaignAllowed ? 'space-between' : 'end'}
      align='center'>
      <Flex gap='0.75rem' align='center'>
        <Text
          style={{
            fontWeight: 600,
            paddingLeft: '0.5rem',
            paddingTop: '0.5rem',
            height: '2.25rem',
            color: DZONE_CLR_BLACK,
          }}>
          <Translate i18nKey='pages.campaigns.title' />
        </Text>
      </Flex>

      <Flex gap='0.75rem' align={'center'}>
        <Hideable show={hasActiveFilters}>
          <Tooltip title={<Translate i18nKey='pages.clearFilters' />}>
            <Button className='dz-btn-action-1' onClick={clearFilters}>
              <Translate i18nKey='Clear Filters' />
            </Button>
          </Tooltip>
        </Hideable>
        {/* Commenting this out for now, this will be used in the future */}
        {/* <Button
          type='primary'
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
          type='primary'
          icon={<DownloadOutlined />}
          className='dz-btn-action-1'
          disabled={isDownloadDisabled}
          />
          <Button
          type='primary'
          icon={<ReloadOutlined />}
          className='dz-btn-action-1'
          disabled={isRefreshDisabled}
          /> */}
        <HasPermission permissions={CampaignActionsEnum.Create}>
          <Link href='/campaign-management/campaigns/create?step=0'>
            <Button
              style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '0.3125rem',
                background:
                  'linear-gradient(white, white) padding-box, linear-gradient(109deg, #FFB8EC 4.89%, #F3D6FF 51.39%, #7D88FF 97.01%) border-box',
                border: '1.5px solid transparent',
                color: CLR_BLACK,
                height: '2.25rem',
              }}>
              <Translate i18nKey='pages.campaigns.label.newCampaign' />
            </Button>
          </Link>
        </HasPermission>
      </Flex>
    </Flex>
  );
};
