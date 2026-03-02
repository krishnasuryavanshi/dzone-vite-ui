'use client';
import { FC } from 'react';
import { Drawer } from '@/uicomponents/drawers';
import { DrawerCloseButton } from '@/app/(dashboard)/components';
import { DeliveryPanel } from './delivery-panel';
import { DzBox } from '@/components/layout/v1';

interface IExportLeadsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lineItemId?: string;
  tenantCode?: string;
}

export const ExportLeadsDrawer: FC<IExportLeadsDrawerProps> = ({
  isOpen,
  onClose,
  lineItemId,
  tenantCode,
}) => {
  return (
    <Drawer
      title='Export Leads'
      onClose={onClose}
      open={isOpen}
      closable
      maskClosable={false}
      placement='right'
      closeIcon={<DrawerCloseButton />}
      destroyOnClose
      width='35rem'>
      <DzBox>
        <DeliveryPanel
          show={true}
          lineItemId={lineItemId || ''}
          tenantCode={tenantCode}
        />
      </DzBox>
    </Drawer>
  );
};
