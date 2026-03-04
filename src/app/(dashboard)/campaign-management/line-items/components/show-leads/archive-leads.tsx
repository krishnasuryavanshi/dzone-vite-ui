import { DzBox } from '@/components/layout/v1';
import { Button } from '@/uicomponents/button';
import React, { FC, useState } from 'react';
import { ConfirmationModal } from '../../../components/show-page';
import { Modal } from '@/uicomponents/modal';
import { leadsStatusUpdate } from '../../services';
import { useLeadsStore } from '../../store';
import { DZONE_CLR_BLACK } from '@/lib/constants';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';

interface IArchiveLeadsProps {
  leadIds: number[];
  tenantCode?: string;
  lineItemId?: string;
  filteredInfo?: Record<string, any>;
}

export const ArchiveLeads: FC<IArchiveLeadsProps> = ({
  leadIds,
  tenantCode,
  lineItemId,
  filteredInfo,
}) => {
  const setSelectedIds = useLeadsStore((state) => state.setSelectedIds);
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const archiveLeads = async () => {
    if (!tenantCode || !leadIds.length || !lineItemId) return;
    setIsLoading(true);
    const leadUpdates = leadIds.map((id) => ({
      id,
      leadStatus: 'Archived',
    }));
    try {
      await leadsStatusUpdate(leadUpdates, tenantCode);
      // Invalidate leads queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
      setSelectedIds([]);
      setShowModal(false);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveClick = () => {
    setShowModal(true);
  };

  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setShowModal(false);
  };

  return (
    <DzBox>
      <Button
        style={{
          height: '2rem',
        }}
        className='dz-btn-action-1'
        disabled={leadIds.length === 0}
        onClick={handleArchiveClick}
      >
        {'Archive'}
      </Button>
      {showModal && (
        <Modal
          open={showModal}
          onCancel={handleCancel}
          footer={null}
          closable={false}
          className='confirm-cancel-modal'
        >
          <ConfirmationModal
            className='confirmation-modal'
            title='Are you sure you want to archive this lead?'
            description='This action is irreversible. All data associated with this lead will be permanently removed from the platform.'
            cancelLabel='Go back'
            proceedLabel='Yes, Archive'
            onProceed={archiveLeads}
            onCancel={handleCancel}
            archiveLeads={true}
            isLoading={isLoading}
          />
        </Modal>
      )}
    </DzBox>
  );
};
