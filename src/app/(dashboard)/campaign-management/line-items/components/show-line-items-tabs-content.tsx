import { FC, useState, useCallback } from 'react';
import { ShowLeads } from './show-leads';
import { LineItemsTabType } from '../lib/enums';
import { LineItemsFilesContainer } from './line-items-files-container';
import { ScheduledDeliveryBar } from './scheduled-delivery-bar';
import { DeliverySchedulesList } from './delivery-schedules';
import { HasPermission } from '@/components/auth';
import { DzBox } from '@/components/layout/v1';
import { DeliveryTemplateActionsEnum, LeadActionsEnum } from '@/lib/enums/permissions';
import { DeliverySchedule } from '../services';
import { usePermissionCheck } from '@/lib/hooks/use-action-permission-check';
import { JobsContainer } from '@/app/(dashboard)/jobs/components';
import { SummaryContainer } from './summary/summary-container';

interface IShowLineTabsContent {
  activeTab: string;
  lineItemId: string;
  tenantCode?: string;
  sessionTenantCode?: string | string[];
}

export const ShowLineItemsTabsContent: FC<IShowLineTabsContent> = ({
  activeTab,
  lineItemId,
  tenantCode,
  sessionTenantCode,
}) => {
  const [schedulesCount, setSchedulesCount] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const canScheduleDelivery = usePermissionCheck(LeadActionsEnum.ScheduleDelivery);

  const processedSessionTenantCode = Array.isArray(sessionTenantCode)
    ? sessionTenantCode.join(',')
    : sessionTenantCode;

  const handleScheduleCreated = () => {
    // Trigger refresh by updating the refresh trigger
    setRefreshTrigger((prev) => prev + 1);
  };

  // State for edit handler from bar
  const [barEditHandler, setBarEditHandler] = useState<
    ((schedule: DeliverySchedule) => void) | null
  >(null);

  const handleRegisterEditHandler = useCallback((handler: (schedule: DeliverySchedule) => void) => {
    setBarEditHandler(() => handler);
  }, []);

  return (
    <>
      <HasPermission permissions={LeadActionsEnum.View}>
        <ShowLeads
          show={activeTab === LineItemsTabType.Leads}
          lineItemId={lineItemId}
          tenantCode={tenantCode}
        />
      </HasPermission>
      <LineItemsFilesContainer show={activeTab === LineItemsTabType.Files} />
      <HasPermission permissions={DeliveryTemplateActionsEnum.View}>
        {activeTab === LineItemsTabType.Delivery && (
          <>
            <ScheduledDeliveryBar
              show={true}
              scheduledCount={schedulesCount}
              lineItemId={lineItemId}
              tenantCode={processedSessionTenantCode}
              onScheduleCreated={handleScheduleCreated}
              onRegisterEditHandler={handleRegisterEditHandler}
            />
            {canScheduleDelivery && (
              <DzBox style={{ marginTop: '-0.5rem' }}>
                <DeliverySchedulesList
                  lineItemId={lineItemId}
                  onSchedulesLoaded={setSchedulesCount}
                  refreshTrigger={refreshTrigger}
                  onEditSchedule={(schedule) => barEditHandler?.(schedule)}
                />
              </DzBox>
            )}
          </>
        )}
      </HasPermission>
      <SummaryContainer show={activeTab === LineItemsTabType.Summary} lineItemId={lineItemId} />
      {activeTab === LineItemsTabType.Jobs && (
        <JobsContainer lineItemId={lineItemId} showHeader={false} hideLineItemColumn={true} />
      )}
    </>
  );
};
