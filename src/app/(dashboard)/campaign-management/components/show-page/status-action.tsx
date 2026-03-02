'use client';
import { DzBox } from '@/components/layout/v1';
import { CLR_BLUE_LIGHT } from '@/lib/constants';
import { LineItemActionsEnum } from '@/lib/enums/permissions';
import { usePermissionCheck } from '@/lib/hooks';
import { showNotification } from '@/services/notification';
import { Select } from '@/uicomponents/form/input';
import { Flex } from '@/uicomponents/layout';
import { Modal } from '@/uicomponents/modal';
import { Spin } from '@/uicomponents/spin';
import { LoadingOutlined } from '@ant-design/icons';
import { FC, SyntheticEvent, useContext, useEffect, useState } from 'react';
import { IStatus } from '../../lib/types';
import { combinedStatusOptions } from '../../lib/utils';
import { LineItemContext } from '../../line-items/contexts';
import { LineItemStatus } from '../../line-items/lib/enums';
import { ILineItem } from '../../line-items/lib/types';
import { updateLineItemStatus } from '../../line-items/services';
import { CampaignStatus } from '../campaign-status';
import { ConfirmationModal } from './confirmation-modal';
import './status-action.scss';

interface IStatusActionProps {
  record: ILineItem;
}

export const StatusAction: FC<IStatusActionProps> = ({ record }) => {
  const lineItem = useContext(LineItemContext);
  const { setUpdateList, statusList }: any = lineItem;

  const isUpdateStatusAllowed = usePermissionCheck(LineItemActionsEnum.Update);

  const [selectedStatus, setSelectedStatus] = useState<IStatus | null>();
  const [updateStatus, setUpdateStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openCancelModal, setOpenCancelModal] = useState<boolean>(false);

  const handleChange = (value: string) => {
    const status = combinedOptions.find(
      (status: any) => status?.value === value,
    );
    setSelectedStatus({
      ...status,
      name: status?.value,
      value: status?.label,
      type: status?.type,
      title: status?.title,
      description: status?.description,
      positiveMessage: status?.positiveMessage,
      negativeMessage: status?.negativeMessage,
    });
    if (status?.value === 'CANCELLED') {
      setOpenCancelModal(true);
    }
  };

  const fetchUpdatedData = async (statusData: IStatus, id: string) => {
    try {
      setIsLoading(true);
      let updatedList;

      updatedList = await updateLineItemStatus(id, {
        type: statusData.type,
        status: statusData.name,
      });
      if (updatedList?.data) {
        setUpdateList(updatedList.data);
        showNotification({
          message: updatedList.message,
        });
      }
    } catch (error) {
      setSelectedStatus(null);
    } finally {
      setIsLoading(false);
      setUpdateStatus(false);
    }
  };
  const handleCancel = (event: SyntheticEvent) => {
    event.stopPropagation();
    setOpenCancelModal(false);
    setUpdateStatus(false);
  };

  const confirmCancel = (event: SyntheticEvent) => {
    event.stopPropagation();
    if (selectedStatus) {
      fetchUpdatedData(selectedStatus, record.id);
      setOpenCancelModal(false);
    }
  };
  useEffect(() => {
    if (!selectedStatus) return;

    const isDifferentStatus = selectedStatus.value !== record.status.value;
    const isStatusCancel = selectedStatus.value !== 'CANCELLED';

    if (isDifferentStatus && isStatusCancel && !openCancelModal) {
      fetchUpdatedData(selectedStatus, record.id);
    }
  }, [selectedStatus]);

  const combinedOptions = combinedStatusOptions(statusList, record);

  if (isLoading) {
    return (
      <Spin
        style={{ marginLeft: '30%' }}
        indicator={
          <LoadingOutlined
            style={{ fontSize: 24, color: `${CLR_BLUE_LIGHT}` }}
            spin
          />
        }
      />
    );
  }

  return (
    <>
      {openCancelModal ? (
        <Modal
          open={openCancelModal}
          onCancel={handleCancel}
          footer={null}
          closable={false}
          className='confirm-cancel-modal'>
          <ConfirmationModal
            className='confirmation-modal'
            title={selectedStatus?.title}
            description={selectedStatus?.description}
            cancelLabel={selectedStatus?.negativeMessage}
            proceedLabel={selectedStatus?.positiveMessage}
            onProceed={confirmCancel}
            onCancel={handleCancel}
          />
        </Modal>
      ) : null}

      {updateStatus ? (
        <Select
          className='custom-status-select'
          open={updateStatus}
          size='large'
          value={selectedStatus?.value}
          placeholder={record.status?.value}
          onClick={(e) => e.stopPropagation()}
          onDropdownVisibleChange={(visible) => {
            if (!visible) {
              setUpdateStatus(false);
            }
          }}
          onChange={handleChange}>
          {combinedOptions.map((status: any) => {
            return (
              <Select.Option key={status?.value} value={status?.value}>
                <Flex justify='space-between'>
                  <span style={{ marginLeft: '8px' }}>{status?.label}</span>
                </Flex>
              </Select.Option>
            );
          })}
        </Select>
      ) : (
        <DzBox
          onClick={(e) => {
            e.stopPropagation();
            if (
              record.status?.value !== LineItemStatus.CANCELLED &&
              isUpdateStatusAllowed
            ) {
              // Making it static here as Cancelled and Paid status we cant promote or demote here
              setUpdateStatus(true);
            }
          }}>
          <CampaignStatus status={record.status} />
        </DzBox>
      )}
    </>
  );
};
