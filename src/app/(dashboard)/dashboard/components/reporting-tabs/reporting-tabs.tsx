import { Translate } from '@/components/i18n';
import { DzBox, DzScrollContainer } from '@/components/layout/v1';
import { Tabs } from '@/uicomponents/tabs';
import { FC, useEffect, useState } from 'react';
import { ReportType } from '../../lib/enums';
import { ReportingTabsContent } from './reporting-tabs-content';
import { usePermissionCheck } from '@/lib/hooks';
import { DashboardPermissions } from '@/lib/enums/permissions';

interface IReportingTabsProps {
  activeTab: string;
  handleTabChange: (key: string) => void;
}

export const ReportingTabs: FC<IReportingTabsProps> = ({ activeTab, handleTabChange }) => {
  const isExecutiveDashboardAvailable = usePermissionCheck(DashboardPermissions.DashboardExecutive);
  const isBillingDashboardAvailable = usePermissionCheck(DashboardPermissions.DashboardBilling);
  const isPerformanceDashboardAvailable = usePermissionCheck(
    DashboardPermissions.DashboardPerformance,
  );
  const isReachDashboardAvailable = usePermissionCheck(DashboardPermissions.DashboardReach);
  const [items] = useState([
    {
      key: ReportType.Executive,
      label: <Translate i18nKey='Executive' />,
      permissions: isExecutiveDashboardAvailable,
    },
    {
      key: ReportType.Performance,
      label: <Translate i18nKey='Performance' />,
      permissions: isPerformanceDashboardAvailable,
    },
    {
      key: ReportType.Billing,
      label: <Translate i18nKey='Billing' />,
      permissions: isBillingDashboardAvailable,
    },
    {
      key: ReportType.Reach,
      label: <Translate i18nKey='Reach' />,
      permissions: isReachDashboardAvailable,
    },
  ]);
  const [allowedItems, setAllowedItems] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    const filteredItems = items.filter((item) => item.permissions);
    setAllowedItems(filteredItems);
    if (filteredItems.length > 0) {
      const isActiveTabAllowed = filteredItems.some((item) => item.key === activeTab);
      if (!isActiveTabAllowed) {
        handleTabChange(filteredItems[0].key as string);
      }
    }
  }, [
    isExecutiveDashboardAvailable,
    isBillingDashboardAvailable,
    isPerformanceDashboardAvailable,
    items,
    activeTab,
    handleTabChange,
  ]);

  if (allowedItems.length === 0) {
    return null;
  }
  return (
    <DzScrollContainer vertical scoll='outside'>
      <DzScrollContainer.Sticky>
        <DzBox dzOneBox>
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={allowedItems as any} // TODO: remove any
          />
        </DzBox>
      </DzScrollContainer.Sticky>
      <DzScrollContainer.Scroll>
        <ReportingTabsContent report={activeTab} />
      </DzScrollContainer.Scroll>
    </DzScrollContainer>
  );
};
