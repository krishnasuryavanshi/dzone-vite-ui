import { Flex } from '@/uicomponents/layout';
import {
  FC,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import { UploadLeads } from '../upload-leads';
import { ValidateLeads } from './validate-leads';
import { LeadActionsEnum } from '@/lib/enums/permissions';
import { usePermissionCheck } from '@/lib/hooks';
import { HasPermission } from '@/components/auth';
import { LineItemContext } from '../../contexts';
import { useLeadsStore } from '../../store';
import { PublishLeads } from './publish-leads';
import { ReturnLeads } from './return-leads';
import { LeadValidationProgress } from './lead-validation-progress';
import { downloadLeadUploadTemplate } from '../../services';
import { saveFileFromBlob } from '@/lib/utils';
import { DownloadOutlined, LoadingOutlined } from '@/uicomponents/icons';
import { Translate } from '@/components/i18n';
import { Link } from '@/uicomponents/link';
import { Button } from '@/uicomponents/button';
import { BulkStatusUpdateDropdown } from '../bulk-status-update-dropdown';
import { ArchiveLeads } from './archive-leads';
import { exportLeadsFilteredByLeadAndValidationStatuses } from '../../../leads/services/export-filtered-leads-by-leads-and-validation-statuses';
import { showNotification } from '@/services/notification';
import { DZONE_CLR_BLACK } from '@/lib/constants';
import { Hideable } from '@/components/shared';
import {
  connectSSE,
  disconnectSSE,
  isSSEConnected,
} from '@/services/sse-service';
import { JobMonitoringService } from '@/lib/constants/client-api-hosts';
import { IJobSSEUpdate } from '@/app/(dashboard)/jobs/lib/types/job';

const TERMINAL_STATUSES = ['SUCCESS', 'FAILED', 'CANCELLED'];

interface ILeadsActionsProps {
  lineItemId: string;
  totalFilteredLeads: number;
  leadStatus: string[];
  validationStatus: string[];
  refreshLeadsList: () => void;
  tenantCode?: string;
  filteredInfo?: Record<string, any>;
}
export const LeadsActions: FC<ILeadsActionsProps> = ({
  lineItemId,
  totalFilteredLeads,
  leadStatus,
  validationStatus,
  refreshLeadsList,
  tenantCode,
  filteredInfo,
}) => {
  const { lineItem } = useContext(LineItemContext);
  const selectedIds = useLeadsStore((state) => state.selectedIds);
  const leadsList = useLeadsStore((state) => state.leadsList);
  const leadsData = useLeadsStore((state) => state.leadsData);
  const isExporting = useLeadsStore((state) => state.isExporting);
  const setIsExporting = useLeadsStore((state) => state.setIsExporting);
  const [isUploadAllowed, setIsUploadAllowed] = useState<boolean>(false);
  const [isPublishAllowed, setIsPublishAllowed] = useState<boolean>(false);
  const hasUploadViewPermission = usePermissionCheck(
    [LeadActionsEnum.View, LeadActionsEnum.Upload],
    true,
  );
  const hasUpdateViewPermission = usePermissionCheck(
    [LeadActionsEnum.View, LeadActionsEnum.Update],
    true,
  );
  const hasPublishPermission = usePermissionCheck(
    [LeadActionsEnum.PublishLead],
    true,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [leadUploadProcessStatus, setLeadUploadProcessStatus] = useState<{
    inValidationCount: number;
    validInvalidCount: number;
  } | null>(null);
  const [taskStatus, setTaskStatus] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const refreshLeadsListRef = useRef(refreshLeadsList);

  // Keep the ref updated
  useEffect(() => {
    refreshLeadsListRef.current = refreshLeadsList;
  }, [refreshLeadsList]);

  // localStorage utilities for requestId
  const getStoredRequestId = (lineItemId: string) => {
    return localStorage.getItem(`leadUploadRequestId_${lineItemId}`);
  };

  const storeRequestId = (lineItemId: string, requestId: string) => {
    localStorage.setItem(`leadUploadRequestId_${lineItemId}`, requestId);
  };

  const clearStoredRequestId = (lineItemId: string) => {
    localStorage.removeItem(`leadUploadRequestId_${lineItemId}`);
  };

  const handleDownloadtemplate = async () => {
    try {
      setIsLoading(true);
      const { data, headers } = await downloadLeadUploadTemplate(
        lineItemId,
        lineItem?.validationSettingsId as string,
        lineItem?.marketerCode || '',
      );
      if (data) {
        const fileName = headers
          .get('content-disposition')
          .split('filename=')[1];
        saveFileFromBlob(
          data,
          fileName.replaceAll('"', ''),
          headers.get('content-type'),
        );
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (lineItem) {
      setIsUploadAllowed(lineItem.uploadAllowed as boolean);
      setIsPublishAllowed(lineItem.uploadAllowed as boolean);
    } else {
      setIsUploadAllowed(false);
    }
  }, [lineItem]);

  // Calculate bulk status update disabled state
  const selectedLeadsStatuses = selectedIds
    .map((id) => leadsList.find((lead) => lead.id === id)?.leadStatus)
    .filter(Boolean);
  const uniqueStatuses = Array.from(new Set(selectedLeadsStatuses));
  const isBulkStatusUpdateDisabled =
    uniqueStatuses.length > 1 || selectedIds.length === 0;

  const createFilters = () => {
    const filters: Record<string, any>[] = [];
    const addFilter = (key: string, value: any) => {
      if (value.length) {
        filters.push({ key, value });
      }
    };

    addFilter('leadStatus', leadsData.selectedLeadsStatus);
    addFilter('leadValidationStatus', leadsData.selectedValidationStatus);
    return filters;
  };

  const onExport = async () => {
    const filters = createFilters();
    try {
      setIsExporting(true);
      const { data, headers } =
        await exportLeadsFilteredByLeadAndValidationStatuses(
          lineItemId,
          filters,
        );
      if (data) {
        showNotification({
          message: 'Leads downloaded successfully.',
        });
        const fileName = headers
          .get('content-disposition')
          .split('filename=')[1];
        saveFileFromBlob(
          data,
          fileName.replaceAll('"', ''),
          headers.get('content-type'),
        );
      }
    } catch (e) {
    } finally {
      setIsExporting(false);
    }
  };

  // SSE connection helper for lead upload monitoring
  const connectLeadSSE = useCallback(
    (jobId: string) => {
      if (isSSEConnected(jobId)) return;

      const endpoint = `${JobMonitoringService}/sse/jobs/${jobId}/stream`;

      connectSSE<IJobSSEUpdate>(jobId, endpoint, {
        onMessage: (data) => {
          if (!data.status) return;

          if (TERMINAL_STATUSES.includes(data.status)) {
            // Job done — clear everything
            disconnectSSE(jobId);
            clearStoredRequestId(lineItemId);
            setRequestId(null);
            setTaskStatus(null);
            setIsValidating(false);
            setLeadUploadProcessStatus(null);
            refreshLeadsListRef.current();
            return;
          }

          const inValidationCount = data.inValidationCount;
          const validInvalidCount = data.validInvalidCount;

          if (
            typeof inValidationCount === 'number' &&
            typeof validInvalidCount === 'number'
          ) {
            // Counts available — show progress bar
            setTaskStatus(null);
            setIsValidating(true);
            setLeadUploadProcessStatus({
              inValidationCount,
              validInvalidCount,
            });
          } else {
            // Still starting up — show task status spinner
            const statusMap: Record<string, string> = {
              PENDING: 'QUEUED',
              IN_PROGRESS: 'IN_PROGRESS',
            };
            setTaskStatus(statusMap[data.status] || data.status);
          }
        },
      });
    },
    [lineItemId],
  );

  // SSE effect: connect when requestId is set, disconnect on cleanup
  useEffect(() => {
    if (!requestId) return;

    connectLeadSSE(requestId);

    return () => {
      disconnectSSE(requestId);
    };
  }, [requestId, lineItemId]);

  // Function to start validation monitoring with requestId
  const startValidationMonitoring = (uploadRequestId?: string) => {
    if (uploadRequestId) {
      storeRequestId(lineItemId, uploadRequestId);
      setRequestId(uploadRequestId);
      setTaskStatus('QUEUED');
    }
  };

  // Check for stored requestId on mount / lineItemId change and resume SSE
  useEffect(() => {
    if (!lineItemId) return;

    // Check if this specific line item has an in-progress upload
    const storedRequestId = getStoredRequestId(lineItemId);
    // Backward compat: also check old validation key from before this change
    const storedValidationRequestId = getStoredRequestId(
      `validation_${lineItemId}`,
    );

    const jobId = storedRequestId || storedValidationRequestId;

    if (jobId) {
      // Migrate old validation key to single key if needed
      if (storedValidationRequestId && !storedRequestId) {
        storeRequestId(lineItemId, storedValidationRequestId);
        clearStoredRequestId(`validation_${lineItemId}`);
      }
      setRequestId(jobId);
      setTaskStatus('QUEUED'); // Will be updated by first SSE message
    }

    return () => {
      // Disconnect SSE when lineItemId changes
      if (jobId) {
        disconnectSSE(jobId);
      }
    };
  }, [lineItemId]);

  const canUploadLeads =
    isUploadAllowed && (hasUploadViewPermission || hasUpdateViewPermission);

  // Show progress bar if task is in progress or validation is in progress
  if (
    taskStatus ||
    isValidating ||
    (leadUploadProcessStatus && leadUploadProcessStatus.inValidationCount > 0)
  ) {
    return (
      <LeadValidationProgress
        inValidationCount={leadUploadProcessStatus?.inValidationCount || 0}
        validInvalidCount={leadUploadProcessStatus?.validInvalidCount || 0}
        taskStatus={taskStatus}
      />
    );
  }

  return (
    <Flex gap='1rem' align='center'>
      {/* <Link to={viewMoreLeadsLink}> // Not needed now might be in future, so commented it
        <Translate i18nKey='viewMore' /> 
      </Link> */}
      {/* Validation might be used later, so commenting it out for now. Currently, validation is performed during upload. */}
      {/* <HasPermission permissions={LeadActionsEnum.ValidateLead}>
        <ValidateLeads
          lineItemId={lineItemId}
          totalFilteredLeads={totalFilteredLeads}
          leadStatus={leadStatus}
          validationStatus={validationStatus}
        />
      </HasPermission> */}
      <HasPermission permissions={[LeadActionsEnum.ReturnLeads]}>
        <ReturnLeads
          leadIds={selectedIds}
          lineItemId={lineItemId}
          onSuccess={refreshLeadsList}
        />
      </HasPermission>

      <HasPermission
        permissions={[LeadActionsEnum.DownloadLead, LeadActionsEnum.View]}>
        {/* DZONE-5739 | changed to DownloadLead from Transform And Export */}
        {/* DZONE-4475 | point - 5 given a role has both 'View Leads' &
            'Download Leads' permissions; when user (mapped to the role)
            downloads leads */}
        <Button
          style={{
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.25rem',
            border: `1px solid ${DZONE_CLR_BLACK}`,
          }}
          onClick={onExport}
          icon={isExporting ? <LoadingOutlined /> : <DownloadOutlined />}
          className='dz-btn-action-1'
          disabled={isExporting}
        />
      </HasPermission>
      <HasPermission permissions={[LeadActionsEnum.StatusUpdate]}>
        <BulkStatusUpdateDropdown
          leadIds={selectedIds}
          disabled={isBulkStatusUpdateDisabled}
          tenantCode={tenantCode}
          lineItemId={lineItemId}
          filteredInfo={filteredInfo}
        />
      </HasPermission>
      <HasPermission permissions={[LeadActionsEnum.ArchiveLead]}>
        <ArchiveLeads
          leadIds={selectedIds}
          tenantCode={tenantCode}
          lineItemId={lineItemId}
          filteredInfo={filteredInfo}
        />
      </HasPermission>
      <Hideable show={canUploadLeads}>
        <Link
          className='dz-link'
          style={{
            width: '12rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          disabled={isLoading}
          onClick={handleDownloadtemplate}>
          {isLoading ? (
            <LoadingOutlined style={{ color: DZONE_CLR_BLACK }} />
          ) : (
            <Translate i18nKey='Download Lead Template' />
          )}
        </Link>
      </Hideable>
      <Hideable
        show={
          isPublishAllowed && leadsList?.length > 0 && hasPublishPermission
        }>
        <PublishLeads
          lineItemId={lineItemId}
          onSuccess={refreshLeadsList}
          selectedLeads={selectedIds}
        />
      </Hideable>
      <Hideable show={canUploadLeads}>
        <UploadLeads
          lineItemId={lineItemId}
          refreshLeadsList={refreshLeadsList}
          tenantCode={tenantCode}
          validationSettingsId={lineItem?.validationSettingsId as string}
          onUploadStart={startValidationMonitoring}
        />
      </Hideable>
    </Flex>
  );
};
