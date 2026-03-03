import { Translate } from '@/components/i18n';
import { DzBox, DzScrollContainer } from '@/components/layout/v1';
import { TabsProps } from '@/lib/types/uicomponents';
import { Tabs } from '@/uicomponents/tabs';
import React, { FC, useState, useEffect } from 'react';
import { LineItemsTabType } from '../lib/enums/line-items-tabs.enum';
import { ShowLineItemsTabsContent } from './show-line-items-tabs-content';
import { usePermissionCheck } from '@/lib/hooks';
import { LeadActionsEnum } from '@/lib/enums/permissions';
import { ViewJobPermissions } from '@/lib/enums/permissions';
import { useSearchParams } from '@/lib/hooks/use-router';
import { useLineItemContextStore } from '../store/use-line-item-context-store';

interface IShowLineItemTabsProps {
  lineItemId: string;
  tenantCode?: string;
  sessionTenantCode?: string | string[];
}

export const ShowLineItemTabs: FC<IShowLineItemTabsProps> = ({
  lineItemId,
  tenantCode,
  sessionTenantCode,
}) => {
  const searchParams = useSearchParams();
  const lineItem = useLineItemContextStore((s) => s.lineItem);
  const canViewLeads = usePermissionCheck(LeadActionsEnum.View);
  const hasPermissiontoTransformAndExport = usePermissionCheck(
    LeadActionsEnum.TransformAndExportLead,
  );
  const canViewJobs = usePermissionCheck(ViewJobPermissions.Jobs);

  const tabParam = searchParams.get('tab');
  const initialTab =
    tabParam === 'delivery' && hasPermissiontoTransformAndExport
      ? LineItemsTabType.Delivery
      : canViewLeads
        ? LineItemsTabType.Leads
        : LineItemsTabType.Files;

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'delivery' && hasPermissiontoTransformAndExport) {
      setActiveTab(LineItemsTabType.Delivery);
    }
  }, [searchParams, hasPermissiontoTransformAndExport]);

  const items: TabsProps['items'] = [
    ...(canViewLeads
      ? [
          {
            key: LineItemsTabType.Leads,
            label: <Translate i18nKey='Leads' />,
          },
        ]
      : []),
    //  Temporary commented out Files tab as it is not in use currently
    // {
    //   key: LineItemsTabType.Files,
    //   label: <Translate i18nKey='Files' />,
    // },
    ...(hasPermissiontoTransformAndExport
      ? [
          {
            key: LineItemsTabType.Delivery,
            label: <Translate i18nKey='Delivery' />,
          },
        ]
      : []),
    ...(canViewJobs
      ? [
          {
            key: LineItemsTabType.Jobs,
            label: <Translate i18nKey='Jobs' />,
          },
        ]
      : []),
    ...(lineItem?.showSummary
      ? [
          {
            key: LineItemsTabType.Summary,
            label: <Translate i18nKey='Summary' />,
          },
        ]
      : []),
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  if (items.length === 0) {
    return null;
  }
  return (
    <DzScrollContainer vertical scoll='outside'>
      <DzScrollContainer.Sticky>
        <DzBox
          dzOneBox
          style={{
            boxShadow: '4px 4px 10px 0 rgba(0, 0, 0, 0.06)',
            borderRadius: '0.5rem',
          }}>
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={items}
          />
        </DzBox>
      </DzScrollContainer.Sticky>
      <ShowLineItemsTabsContent
        activeTab={activeTab}
        lineItemId={lineItemId}
        tenantCode={tenantCode}
        sessionTenantCode={sessionTenantCode}
      />
    </DzScrollContainer>
  );
};
