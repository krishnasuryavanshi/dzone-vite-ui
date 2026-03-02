import { FC, useState, useEffect, useCallback } from 'react';
import { Button, Space, Typography } from 'antd';
import { Flex } from '@/uicomponents/layout';
import { DzBox } from '@/components/layout/v1';
import { ExportLeadsDrawer } from './export-leads-drawer';
import { ScheduleDeliveryDrawer } from './schedule-delivery-drawer';
import { DeliverySchedule } from '../services';
import { usePermissionCheck } from '@/lib/hooks/use-action-permission-check';
import { LeadActionsEnum } from '@/lib/enums/permissions/lead.enum';
import { useLeadsCountStore } from '../../leads/store';

const { Text } = Typography;

interface IScheduledDeliveryBarProps {
  show: boolean;
  scheduledCount?: number;
  lineItemId?: string;
  tenantCode?: string;
  onScheduleDelivery?: () => void;
  onScheduleCreated?: () => void;
  onRegisterEditHandler?: (
    handler: (schedule: DeliverySchedule) => void,
  ) => void;
}

export const ScheduledDeliveryBar: FC<IScheduledDeliveryBarProps> = ({
  show,
  scheduledCount = 1,
  lineItemId,
  tenantCode,
  onScheduleDelivery,
  onScheduleCreated,
  onRegisterEditHandler,
}) => {
  const totalLeads = useLeadsCountStore((state) => state.totalLeads);
  const isDisabled = totalLeads === 0;

  const [isExportDrawerOpen, setIsExportDrawerOpen] = useState(false);
  const [isScheduleDrawerOpen, setIsScheduleDrawerOpen] = useState(false);
  const [editSchedule, setEditSchedule] = useState<DeliverySchedule | null>(
    null,
  );

  const canScheduleDelivery = usePermissionCheck(
    LeadActionsEnum.ScheduleDelivery,
  );

  const handleExportClick = () => {
    setIsExportDrawerOpen(true);
  };

  const handleExportDrawerClose = () => {
    setIsExportDrawerOpen(false);
  };

  const handleScheduleClick = () => {
    setEditSchedule(null); // Clear any edit schedule
    setIsScheduleDrawerOpen(true);
    onScheduleDelivery?.();
  };

  const handleEditSchedule = useCallback((schedule: DeliverySchedule) => {
    setEditSchedule(schedule);
    setIsScheduleDrawerOpen(true);
  }, []);

  useEffect(() => {
    if (onRegisterEditHandler) {
      onRegisterEditHandler(handleEditSchedule);
    }
  }, [onRegisterEditHandler, handleEditSchedule]);

  if (!show) {
    return null;
  }

  const handleScheduleDrawerClose = () => {
    setIsScheduleDrawerOpen(false);
    setEditSchedule(null);
  };

  const handleScheduleCreated = () => {
    onScheduleCreated?.();
  };

  return (
    <>
      <DzBox dzOneBox>
        <Flex justify='space-between' align='center'>
          {canScheduleDelivery ? (
            <Text strong>Scheduled delivery ({scheduledCount})</Text>
          ) : (
            <div />
          )}
          <Space>
            <Button
              onClick={handleExportClick}
              disabled={isDisabled}
              className='dz-btn-action-1'>
              Export
            </Button>
            {canScheduleDelivery && (
              <Button className='dz-btn-action-1' onClick={handleScheduleClick}>
                Schedule Delivery
              </Button>
            )}
          </Space>
        </Flex>
      </DzBox>
      <ExportLeadsDrawer
        isOpen={isExportDrawerOpen}
        onClose={handleExportDrawerClose}
        lineItemId={lineItemId}
        tenantCode={tenantCode}
      />
      {canScheduleDelivery && (
        <ScheduleDeliveryDrawer
          isOpen={isScheduleDrawerOpen}
          onClose={handleScheduleDrawerClose}
          lineItemId={lineItemId || ''}
          onScheduleCreated={handleScheduleCreated}
          editSchedule={editSchedule}
        />
      )}
    </>
  );
};
