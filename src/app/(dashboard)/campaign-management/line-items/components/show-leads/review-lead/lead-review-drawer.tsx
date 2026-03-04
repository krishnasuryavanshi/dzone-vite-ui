import { Text } from '@/uicomponents';
import { Drawer } from '@/uicomponents/drawers';
import { FC } from 'react';
import { LeadReviewContainer } from './lead-review-container';

import './lead-review-drawer.scss';
import { DrawerCloseButton } from '@/app/(dashboard)/components';

interface ILeadReviewDrawerProps {
  isOpen: boolean;
  currentLeadTrackingId: string;
  currentLeadId: number;
  lineItemId: string;
  leadStatuses: string[];
  validationStatuses: string[];
  handleClose: () => void;
  tenantCode?: string;
}

export const LeadReviewDrawer: FC<ILeadReviewDrawerProps> = ({
  isOpen,
  currentLeadTrackingId,
  currentLeadId,
  lineItemId,
  leadStatuses,
  validationStatuses,
  handleClose,
  tenantCode,
}) => {
  return (
    <Drawer
      className='dz-drawer dz-lead-review-drawer'
      closable
      destroyOnClose
      maskClosable={false}
      size='large'
      placement='right'
      closeIcon={<DrawerCloseButton />}
      title={<Text strong>Lead Review</Text>}
      open={isOpen}
      onClose={handleClose}
    >
      <LeadReviewContainer
        show={isOpen}
        selectedLeadTrackingId={currentLeadTrackingId}
        selectedCurrentLeadId={currentLeadId}
        lineItemId={lineItemId}
        leadStatuses={leadStatuses}
        validationStatuses={validationStatuses}
        tenantCode={tenantCode}
      />
    </Drawer>
  );
};
