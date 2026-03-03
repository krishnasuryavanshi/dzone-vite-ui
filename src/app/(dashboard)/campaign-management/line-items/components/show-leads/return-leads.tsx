import { DzBox } from '@/components/layout/v1';
import { showNotification } from '@/services/notification';
import { Button } from '@/uicomponents/button';
import React, { FC, useState } from 'react';
import { returnLeads } from '../../services';
import { useReturnReasonsQuery } from '../../hooks';
import { ReturnReasonsModal } from './return-reasons-Modal';
import { DZONE_CLR_BLACK } from '@/lib/constants';

interface IReturnLeadsProps {
  lineItemId: string;
  leadIds: number[];
  onSuccess: () => void;
}

export const ReturnLeads: FC<IReturnLeadsProps> = ({
  lineItemId,
  leadIds,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  const { data: reasonsData } = useReturnReasonsQuery();
  const reasons = reasonsData?.data ?? [];

  const openModal = async () => {
    setIsModalOpen(true);
  };

  const onCancel = () => {
    setIsModalOpen(false);
    setSelectedReasons([]);
  };

  const handleSelectReason = (reasons: string[]) => {
    setSelectedReasons(reasons);
  };

  const handleReturnLeads = async () => {
    setIsLoading(true);
    try {
      const data = await returnLeads(lineItemId, leadIds, selectedReasons);
      if (data?.message) {
        showNotification({
          type: 'success',
          message: data.message,
        });
      }
      onSuccess();
      setIsModalOpen(false);
      setSelectedReasons([]);
    } catch (error) {
      // Already handled in the service
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DzBox>
      <Button
        style={{
          height: '2rem',
          display: 'flex',
          alignItems: 'center',
          border:
            leadIds.length === 0
              ? `1px solid #d4d4d4`
              : `1px solid ${DZONE_CLR_BLACK}`,
          minWidth: '7rem',
        }}
        disabled={leadIds.length === 0 || isLoading}
        loading={isLoading}
        onClick={openModal}>
        {!isLoading && 'Return Leads'}
      </Button>
      <ReturnReasonsModal
        isModalOpen={isModalOpen}
        selectedReasons={selectedReasons}
        handleReturnLeads={handleReturnLeads}
        reasons={reasons}
        leadIds={leadIds}
        onCancel={onCancel}
        isLoading={isLoading}
        handleSelectReason={handleSelectReason}
      />
    </DzBox>
  );
};
