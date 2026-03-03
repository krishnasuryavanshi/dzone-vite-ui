import { Translate } from '@/components/i18n';
import { Button } from '@/uicomponents';
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

interface IFilterActionsProps {
  reset?: () => void;
  submit?: () => void;
  activeTab: string;
}

export const FilterActions: FC<IFilterActionsProps> = ({
  reset,
  submit,
  activeTab,
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
    <Flex
      gap="0.75rem"
      justify="flex-start"
    >
      <Button
        disabled={loading}
        className="dz-btn-action"
        onClick={submit}
      >
        <Translate i18nKey="form.actions.submit" />
      </Button>
      <Button
        disabled={loading}
        className="dz-btn-action"
        onClick={reset}
      >
        <Translate i18nKey="form.actions.reset" />
      </Button>
    </Flex>
  );
};
