import { Button } from '@/uicomponents';
import { DownloadOutlined, ReloadOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import React, { FC } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { HasPermission } from '@/components/auth';
import { DashboardActionsEnum } from '@/lib/enums/permissions';

interface IActionsProps {
  refresh: () => void;
  activeTab: string;
  isDownloadDisabled: boolean;
}

export const Actions: FC<IActionsProps> = ({
  refresh,
  activeTab,
  isDownloadDisabled,
}) => {
  const fetchingCount = useIsFetching({ queryKey: ['dashboard'] });
  const loading = fetchingCount > 0;

  return (
    <Flex gap={'0.75rem'} justify='flex-end'>
      <HasPermission permissions={DashboardActionsEnum.Download}>
        <Button
          disabled={loading || isDownloadDisabled}
          icon={<DownloadOutlined />}
          className='dz-btn-action'
        />
      </HasPermission>
      <Button
        disabled={loading}
        onClick={refresh}
        icon={<ReloadOutlined />}
        className='dz-btn-action'
      />
    </Flex>
  );
};
