import { Button } from '@/uicomponents';
import { DownloadOutlined, ReloadOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import React, { FC, useEffect, useState } from 'react';
import { useDashboardReportStore } from '../../store/use-dashboard-report-store';

import {
  BillingReportType,
  ExecutiveReportType,
  PerformanceCountsType,
  ReachReportType,
  ReportType,
} from '../../lib/enums';
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
  const progress = useDashboardReportStore((s) => s.progress);
  const [loading, setLoading] = useState(true);

  const isReportTypeKey = (key: string): boolean => {
    switch (activeTab) {
      case ReportType.Executive:
        return (Object.values(ExecutiveReportType) as string[]).includes(key);
      case ReportType.Performance:
        return (Object.values(PerformanceCountsType) as string[]).includes(key);
      case ReportType.Billing:
        return (Object.values(BillingReportType) as string[]).includes(key);
      case ReportType.Reach:
        return (Object.values(ReachReportType) as string[]).includes(key);
      default:
        return false;
    }
  };

  useEffect(() => {
    const isLoading = Object.keys(progress)
      .filter((key) => isReportTypeKey(key))
      .some((key) => progress[key] === 'loading');
    setLoading(isLoading);
  }, [progress, activeTab]);

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
