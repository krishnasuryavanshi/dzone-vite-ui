import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { FC, useState, useRef, useCallback } from 'react';
import { DeliveryFilterManager } from './delivery-filter-manager';
import { ITemplateInfo } from '@/app/(dashboard)/integrations-hub/templates/lib/types';
import { showNotification } from '@/services/notification';
import { Translate } from '@/components/i18n';
import { Modal } from '@/uicomponents/modal';
import { ExportAndTransformModal } from './export-and-transform-modal';
import { ModalFooter } from './modal-footer';
import { ModalHeader } from './modal-header';
import { Text } from '@/uicomponents';
import {
  SUCCESS_HEADER_MESSAGE,
  templateSelectedSuccessMessage,
  TRANSFORM_AND_EXPORT_SUCCESS_MESSAGE,
} from '../../lib/constants';
import { saveFileFromBlob } from '@/lib/utils';
import { transformAndExportLeads } from '../../services/transform-and-export-leads';
import { Tooltip } from '@/uicomponents/tooltip';
import { Pagination } from '@/uicomponents';
import { IToastState } from '@/app/(dashboard)/lib/types';
import { ToastManager } from '@/app/(dashboard)/components/toast-manager/toast-manager';
import { ToastWithActionButton } from '@/app/(dashboard)/components/toast-manager/toast-with-action-button';
import { useLeadsCountQuery } from '../../hooks';
import { DeliveryTransformAndExportButton } from './delivery-transform-and-export-button';
import { Refresh } from '../show-leads/refresh';
import { TransformHistoryTable, TransformHistoryTableRef } from './transform-history-table';

interface IDeliveryPanel {
  show: boolean;
  lineItemId: string;
  tenantCode?: string;
}

export const DeliveryPanel: FC<IDeliveryPanel> = ({ show, lineItemId, tenantCode }) => {
  const exportLogsTableRef = useRef<TransformHistoryTableRef>(null);
  const [selectedLeadStatuses, setSelectedLeadStatuses] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplateInfo | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tablePagination, setTablePagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [dialogState, setDialogState] = useState<IToastState>({
    isToastOpen: false,
    toastType: 'Progress',
    progress: 0,
    header: '',
    message: '',
    statusCode: 0,
  });

  const { data: totalFilteredLeads = 0 } = useLeadsCountQuery(lineItemId, selectedLeadStatuses);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const updateSelectedTemplate = (template: ITemplateInfo) => {
    setSelectedTemplate(template);
    showNotification({
      message: <Translate i18nKey={templateSelectedSuccessMessage(template?.name)} />,
      type: 'success',
      duration: 1,
    });
  };

  const updateSelectedLeadStatuses = (statuses: string[]) => {
    setSelectedLeadStatuses(statuses);
  };

  const createFilters = useCallback(() => {
    const filters: Record<string, any>[] = [];
    if (selectedLeadStatuses.length) {
      filters.push({ key: 'leadStatus', value: selectedLeadStatuses });
    }
    return filters;
  }, [selectedLeadStatuses]);

  if (!show) {
    return null;
  }
  const handleDialogState = (stateItem: Record<string, string | number | boolean>) => {
    setDialogState((state) => ({ ...state, ...stateItem }));
  };

  const handleCloseDialog = () => {
    setDialogState((state) => ({ ...state, isToastOpen: false }));
  };

  const handleRetryAttempt = async () => {
    handleDialogState({
      isToastOpen: false,
      toastType: 'Progress',
      progress: 0,
    });
    handleProceed();
  };

  const handleProceed = async () => {
    try {
      setIsLoading(true);
      handleDialogState({
        isToastOpen: true,
        toastType: 'Progress',
        progress: 20,
      });

      const filters = createFilters();
      const requestPayload = {
        lineItemId: lineItemId,
        templateId: selectedTemplate?.id,
        filters,
      };
      const { data, headers, error } = await transformAndExportLeads(requestPayload);
      if (data) {
        // Check if it's a 202 response (async processing)
        if (
          data.statusCode === 202 ||
          (typeof data === 'object' && data.message && data.requestId)
        ) {
          // Handle async processing response - use exact message from backend
          showNotification({
            messageHeader: 'Processing',
            message: data.message,
            type: 'success',
            duration: 7,
          });

          // Refresh the export logs table to show the processing status
          setTimeout(() => {
            exportLogsTableRef.current?.refreshData();
          }, 1000);

          closeModal();
        } else {
          // Handle direct file download response
          const fileName = headers.get('content-disposition')?.split('filename=')[1];
          if (fileName) {
            saveFileFromBlob(data, fileName.replaceAll('"', ''), headers.get('content-type'));
          }

          // Refresh the export logs table to show the latest export
          setTimeout(() => {
            exportLogsTableRef.current?.refreshData();
          }, 1000);

          handleDialogState({
            isToastOpen: true,
            toastType: 'Success',
            progress: 100,
            header: SUCCESS_HEADER_MESSAGE,
            message: TRANSFORM_AND_EXPORT_SUCCESS_MESSAGE,
            statusCode: 200,
          });
          setTimeout(() => {
            handleDialogState({
              isToastOpen: false,
              toastType: 'Progress',
              progress: 0,
              header: '',
              message: '',
              statusCode: 0,
            });
          }, 3000);
          closeModal();
        }
      }
      let toastType = 'Progress';
      if (error) {
        const errorMessage = error?.message;
        const errorHeader = error?.messageHeader;
        handleDialogState({
          isToastOpen: true,
          toastType: 'Error',
          progress: 100,
          header: errorHeader || null,
          message: errorMessage,
          statusCode: error?.statusCode,
        });
        toastType = 'Error';
      }
      setTimeout(() => {
        if (error?.statusCode !== 400) {
          handleDialogState({
            isToastOpen: false,
            toastType: toastType as any,
            progress: 0,
            header: '',
            message: '',
            statusCode: 0,
          });
        }
      }, 3000);
    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DzBox>
        <Flex
          vertical
          gap='1rem'
          style={{
            width: '100%',
            minHeight: '8rem',
            height: 'calc(100vh - 24rem)',
          }}
        >
          <DeliveryFilterManager
            updateSelectedLeadStatuses={updateSelectedLeadStatuses}
            updateSelectedTemplate={updateSelectedTemplate}
            selectedLeadStatuses={selectedLeadStatuses}
            selectedTemplate={selectedTemplate}
            tenantCode={tenantCode}
            lineItemId={lineItemId}
          />
          <Flex justify='end' style={{ width: '100%' }}>
            <Tooltip
              placement='top'
              title={
                selectedTemplate ? (
                  <Translate i18nKey='pages.delivery.enabledTooltipMessage' />
                ) : (
                  <Translate i18nKey='pages.delivery.disabledTooltipMessage' />
                )
              }
              arrow={{ pointAtCenter: true }}
            >
              <Flex>
                <DeliveryTransformAndExportButton
                  openModal={openModal}
                  selectedTemplate={selectedTemplate}
                />
              </Flex>
            </Tooltip>
          </Flex>
          <Flex vertical gap='1rem' style={{ width: '100%' }}>
            <Flex justify='space-between' align='center' style={{ width: '100%' }}>
              <Flex gap='0.5rem' align='center'>
                <Text strong style={{ fontSize: '1rem' }}>
                  Logs
                </Text>
                <Refresh onRefresh={() => exportLogsTableRef.current?.refreshData()} />
              </Flex>
              <Pagination
                showSizeChanger
                showLessItems
                current={tablePagination.current}
                total={tablePagination.total}
                pageSize={tablePagination.pageSize}
                onChange={(page, pageSize) =>
                  exportLogsTableRef.current?.handlePageChange(
                    page,
                    pageSize || tablePagination.pageSize,
                  )
                }
              />
            </Flex>
            <TransformHistoryTable
              ref={exportLogsTableRef}
              lineItemId={lineItemId}
              onPaginationChange={setTablePagination}
            />
          </Flex>
        </Flex>
      </DzBox>
      <Modal
        width={'50%'}
        open={isOpen}
        onCancel={closeModal}
        closable={!isLoading}
        maskClosable={false}
        title={<ModalHeader title='pages.transformAndExportLeads' />}
        footer={
          <ModalFooter
            isLoading={isLoading}
            onCancel={closeModal}
            handleProceed={handleProceed}
            filterLeadsCount={totalFilteredLeads}
          />
        }
      >
        <ExportAndTransformModal filterLeadsCount={totalFilteredLeads} />
      </Modal>
      <ToastManager dialogState={dialogState} onClose={handleCloseDialog}>
        {dialogState.toastType === 'Error' && dialogState.statusCode === 400 ? (
          <ToastWithActionButton
            show={dialogState.toastType === 'Error'}
            onClick={handleRetryAttempt}
            variant='Failure'
            buttonText='Try Again'
          />
        ) : dialogState.toastType === 'Success' ? (
          <ToastWithActionButton show={dialogState.toastType === 'Success'} variant='Success' />
        ) : null}
      </ToastManager>
    </>
  );
};
