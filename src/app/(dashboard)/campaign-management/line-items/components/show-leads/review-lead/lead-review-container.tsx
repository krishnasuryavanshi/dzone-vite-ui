import { LeadValidationStatus } from '@/app/(dashboard)/campaign-management/leads/lib/enums';
import { ILead } from '@/app/(dashboard)/campaign-management/leads/lib/types';
import { getDeltaOfObjects, hasUnsavedChanges } from '@/lib/utils';
import { showNotification } from '@/services/notification';
import { LoadingOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { FC, useEffect, useMemo, useState } from 'react';
import {
  LEAD_IN_VALIDATION_ERROR_MESSAGE,
  LEAD_VALIDATION_SKIPPED_DUE_TO_NO_CHANGES,
} from '../../../../lib/constants';
import { updateLeadDetails } from '../../../services';
import { LeadInfo } from './lead-info';
import { LeadMeta } from './lead-meta';
import { Navigation } from './navigation';
import { IGNORE_VALIDATION_ERRORS_STATUSES } from '../../../lib/constants';
import {
  transformJobTitles,
  formatDateFieldsForPayload,
} from '../../../lib/utils';
import { DzRecord } from '@/lib/types';
import {
  useLeadDetailQuery,
  useLeadReviewFormConfigQuery,
  useReviewLeadsListQuery,
} from '../../../hooks';

interface ILeadReviewContainerProps {
  show: boolean;
  selectedLeadTrackingId: string;
  selectedCurrentLeadId: number;
  lineItemId: string;
  leadStatuses: string[];
  validationStatuses: string[];
  tenantCode?: string;
}
export interface LeadError {
  field: string;
  message: string;
}

export const LeadReviewContainer: FC<ILeadReviewContainerProps> = ({
  show,
  selectedLeadTrackingId,
  selectedCurrentLeadId,
  lineItemId,
  leadStatuses,
  validationStatuses,
  tenantCode,
}) => {
  const [currentLeadTrackingId, setCurrentLeadTrackingId] =
    useState<string>('');
  const [currentLeadId, setCurrentLeadId] = useState<number>(0);
  const [currentLeadNumber, setCurrentLeadNumber] = useState(0);
  const [leadValidationStatus, setLeadValidationStatus] = useState<string>('');
  const [initialFormValue, setInitialFormValue] = useState<Record<string, any>>(
    {},
  );
  const [formValue, setFormValue] = useState<Record<string, any>>({});
  const [leadErrorMessages, setLeadErrorMessages] = useState<LeadError[]>([]);
  const [disableRevalidate, setDisableRevalidate] = useState(false);

  // Build filters for review leads list
  const reviewFilters = useMemo(() => {
    const filters: Record<string, any>[] = [];
    if (leadStatuses.length > 0) {
      filters.push({ key: 'leadStatus', value: leadStatuses });
    }
    if (validationStatuses.length > 0) {
      filters.push({ key: 'leadValidationStatus', value: validationStatuses });
    }
    return filters;
  }, [leadStatuses, validationStatuses]);

  // TanStack Query: review leads list
  const { data: reviewData } = useReviewLeadsListQuery(
    lineItemId,
    reviewFilters,
    !!lineItemId,
  );

  const leadTrackingIds = useMemo(
    () => (reviewData?.data ?? []).map((item: { trackingId: string }) => item.trackingId),
    [reviewData],
  );
  const leadIds = useMemo(
    () => (reviewData?.data ?? []).map((item: { id: number }) => item.id),
    [reviewData],
  );

  // Determine if polling is needed
  const shouldPoll =
    !!leadValidationStatus &&
    [
      LeadValidationStatus.NotStarted,
      LeadValidationStatus.InValidation,
      LeadValidationStatus.Scheduled,
    ].includes(leadValidationStatus as LeadValidationStatus);

  // TanStack Query: lead details with polling
  const { data: leadDetails } = useLeadDetailQuery(
    currentLeadId,
    tenantCode,
    !!currentLeadId,
    { refetchInterval: shouldPoll ? 15000 : false },
  );

  // TanStack Query: form config
  const { data: formConfigResult } = useLeadReviewFormConfigQuery(
    'panel',
    lineItemId,
    !!lineItemId,
  );
  const leadReviewFormConfig: DzRecord[] = formConfigResult?.data ?? [];

  // Sync lead details from query into local state
  useEffect(() => {
    if (leadDetails) {
      setLeadValidationStatus(leadDetails.leadValidationStatus);
      processValidationHistory(
        leadDetails.leadValidationStatus,
        leadDetails.validationHistory,
      );
    }
  }, [leadDetails]);

  // Set current lead when selection or review list changes
  useEffect(() => {
    if (selectedLeadTrackingId && leadTrackingIds.length > 0) {
      setCurrentLeadTrackingId(selectedLeadTrackingId);
      setCurrentLeadId(selectedCurrentLeadId);
      setCurrentLeadNumber(leadIds.indexOf(selectedCurrentLeadId) + 1);
    }
  }, [selectedLeadTrackingId, leadTrackingIds, leadIds, selectedCurrentLeadId]);

  // Reset lead state when navigating to a new lead
  useEffect(() => {
    setLeadValidationStatus('');
  }, [currentLeadTrackingId]);

  const handlePrevNavigation = () => {
    const newCurrentLeadNumber = currentLeadNumber - 1;
    handleLeadChange(newCurrentLeadNumber);
  };

  const handleNextNavigation = () => {
    const newCurrentLeadNumber = currentLeadNumber + 1;
    handleLeadChange(newCurrentLeadNumber);
  };

  const handleLeadChange = (newCurrentLeadNumber: number) => {
    const newCurrentLeadId = leadIds[newCurrentLeadNumber - 1];
    const newCurrentLeadTrackingId = leadTrackingIds[newCurrentLeadNumber - 1];
    setCurrentLeadNumber(newCurrentLeadNumber);
    setCurrentLeadId(newCurrentLeadId);
    setCurrentLeadTrackingId(newCurrentLeadTrackingId);
  };

  const handleRevalidateDisability = (status: boolean) => {
    setDisableRevalidate(status);
  };

  const handleSaveAndRevalidate = async () => {
    const hasUnsavedData = hasUnsavedChanges(initialFormValue, formValue);
    if (hasUnsavedData) {
      if (leadValidationStatus === LeadValidationStatus.InValidation) {
        showNotification({
          message: LEAD_IN_VALIDATION_ERROR_MESSAGE,
          type: 'error',
        });
        return;
      }

      const reviewLeadDifference = getDeltaOfObjects(
        initialFormValue,
        formValue,
      );

      const leadDifferenceWithJobGroup = transformJobTitles(
        reviewLeadDifference,
        formValue,
      );

      const formattedPayload = formatDateFieldsForPayload(
        leadDifferenceWithJobGroup,
        leadReviewFormConfig,
      );

      await handleSave(formattedPayload);
    } else {
      showNotification({
        message: LEAD_VALIDATION_SKIPPED_DUE_TO_NO_CHANGES,
        type: 'error',
      });
    }
  };

  const processValidationHistory = (
    leadValidationStatus: LeadValidationStatus,
    validationHistory: any,
  ) => {
    setLeadErrorMessages([]);
    if (IGNORE_VALIDATION_ERRORS_STATUSES.includes(leadValidationStatus)) {
      return;
    }
    const errors: LeadError[] = [];
    if (Array.isArray(validationHistory)) {
      validationHistory.forEach(
        (error: { field: string; messages: string[] }) => {
          if (error.messages && Array.isArray(error.messages)) {
            error.messages.forEach((message: string) => {
              errors.push({
                field: error.field,
                message: message,
              });
            });
          }
        },
      );
    }
    if (errors.length > 0) {
      setLeadErrorMessages(errors);
    }
  };

  const handleSave = async (reviewLeadDifference: Record<string, any>) => {
    try {
      const { data } = await updateLeadDetails(
        currentLeadId,
        reviewLeadDifference,
        tenantCode,
      );
      if (data) {
        setLeadValidationStatus(data.leadValidationStatus);
        showNotification({
          message: 'Lead details updated successfully and being validated.',
          type: 'success',
        });
      }
    } catch (error) {
      showNotification({
        message: 'Failed to update lead details. Please try again.',
        type: 'error',
      });
    }
  };

  const updateInitialFormValues = (initialValues: Record<string, any>) => {
    setInitialFormValue(initialValues);
    setFormValue(initialValues);
  };

  const updateFormValues = (formValue: Record<string, any>) => {
    setFormValue(formValue);
  };

  if (!show) return null;

  if (
    !currentLeadNumber ||
    !currentLeadTrackingId ||
    !leadTrackingIds?.length
  ) {
    return <LoadingOutlined />;
  }

  return (
    <Flex style={{ height: '100%' }}>
      <LeadMeta
        validationStatus={leadValidationStatus}
        trackingId={currentLeadTrackingId}
        revalidationAllowed={leadDetails?.revalidationAllowed}
        disableRevalidate={disableRevalidate}
        leadStatus={leadDetails?.leadStatus}
        handleSaveAndRevalidate={handleSaveAndRevalidate}>
        <Navigation
          totalLeads={leadTrackingIds.length}
          currentLeadNumber={currentLeadNumber}
          handleNext={handleNextNavigation}
          handlePrev={handlePrevNavigation}
        />
      </LeadMeta>
      <LeadInfo
        leadDetails={leadDetails ?? null}
        updateInitialFormValue={updateInitialFormValues}
        handleFormValueChange={updateFormValues}
        leadErrorMessages={leadErrorMessages}
        leadValidationStatus={leadValidationStatus}
        handleRevalidateDisability={handleRevalidateDisability}
        leadReviewFormConfig={leadReviewFormConfig}
      />
    </Flex>
  );
};
