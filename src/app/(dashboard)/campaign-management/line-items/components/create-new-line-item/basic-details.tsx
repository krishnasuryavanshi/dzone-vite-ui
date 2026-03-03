
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Form, FormItem, useForm, useWatch } from '@/uicomponents/form';
import { Col, Row } from '@/uicomponents/layout/grid';
import { Text } from '@/uicomponents/text';
import { Translate } from '@/components/i18n';
import { Button } from '@/uicomponents/button';
import { Flex, Space } from '@/uicomponents/layout';
import { Tooltip } from '@/uicomponents';
import BasicDetailsSchema from '../../lib/schemas/basic-details.json';
import { renderField } from './render-field';
import { PacingChartDrawer } from './pacing-chart-drawer';
import { PacingChangeConfirmation } from './pacing-change-confirmation';
import {
  fetchFileDetails,
  fetchMultipleFileDetails,
} from '../../services';
import { ICampaign } from '../../../campaigns/lib/types';
import { debounce } from 'lodash';
import { useRouter } from '@/lib/hooks/use-router';
import { dateObject, formatDate, sanitizeData } from '@/lib/utils';
import { showNotification } from '@/services/notification';
import {
  useCreateLineItemMutation,
  useUpdateLineItemMutation,
  usePrefilledListsBasicDetailsQuery,
  useCampaignsByMarketerQuery,
  useValidationTemplatesQuery,
} from '../../hooks';
import {
  formatLineItemFormData,
  processFieldPermissions,
} from '../../../lib/utils';
import { ILineItem } from '../../lib/types';
import dayjs from 'dayjs';
import { LoaderButton } from '@/components/shared';
import { UploadFile } from '@/lib/types/uicomponents';
import {
  DATE_FIELDS,
  EXCLUDED_DATE_FIELDS,
  PACING_KEYS,
} from '../../lib/constants';
import { LineItemFields, PacingType, Pacing } from '../../lib/enums';
import { InfoCircleOutlined } from '@/uicomponents/icons';
import {
  getDateFieldRestrictions,
  isValidTargetEndDate,
  getDateValidationMessage,
} from '../../lib/utils/date-field-restrictions';

interface IBasicDetailsProps {
  campaignUuid?: string;
  campaignData?: any;
  lineItemId?: string;
  lineItemDetails?: ILineItem;
  userId?: string;
  tenantCode?: string | string[];
  isDzoneUser?: boolean;
  targetLeadGoal?: number;
  onCreateSuccess: (newLineItemId: string) => void;
  onUpdateSuccess?: (updatedData: any) => void;
  nextStep?: number;
  handleStepperChange?: (key: number) => void;
}

export const BasicDetails: FC<IBasicDetailsProps> = ({
  campaignUuid,
  campaignData,
  lineItemId,
  lineItemDetails,
  userId,
  onCreateSuccess,
  onUpdateSuccess,
  nextStep,
  handleStepperChange,
}) => {
  const previousMarketerCode = useRef<string | undefined>(undefined);

  const router = useRouter();
  const createMutation = useCreateLineItemMutation();
  const updateMutation = useUpdateLineItemMutation();
  const [form] = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disabledFields, setDisabledFields] = useState<Record<string, boolean>>(
    {},
  );
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [dateFieldRestrictions, setDateFieldRestrictions] = useState<any>({});
  const [originalTargetEndDate, setOriginalTargetEndDate] = useState<any>(null);
  const [pacingDrawerOpen, setPacingDrawerOpen] = useState(false);
  const [originalPacingValue, setOriginalPacingValue] = useState<string | null>(
    null,
  ); // Original pacing value from backend
  const [pacingDisabledPermanently, setPacingDisabledPermanently] =
    useState<boolean>(false);
  const [isLineItemBeenLive, setIsLineItemBeenLive] = useState<boolean>(false);
  const [showPacingConfirmation, setShowPacingConfirmation] =
    useState<boolean>(false);
  const [overflowDisabledPermanently, setOverflowDisabledPermanently] =
    useState<boolean>(false);
  const [pacingFieldsChanged, setPacingFieldsChanged] =
    useState<boolean>(false);
  const [pacingChangedFields, setPacingChangedFields] = useState<string[]>([]);
  const [initialPacingFieldValues, setInitialPacingFieldValues] =
    useState<any>(null);

  const allFields = useWatch([], form);
  const marketerCode = allFields?.marketerCode;
  const pacingSchedule = allFields?.pacingSchedule;
  const pacingType = allFields?.pacing;

  // TanStack Query hooks for server state
  const { data: prefilledListsData } = usePrefilledListsBasicDetailsQuery(userId);
  const { data: campaignsRawData } = useCampaignsByMarketerQuery(
    marketerCode,
    !!marketerCode,
  );
  const { data: validationData } = useValidationTemplatesQuery(marketerCode);

  const lists = useMemo<Record<string, any[]>>(() => {
    const base = prefilledListsData ? { ...(prefilledListsData as Record<string, any[]>) } : {};

    if (campaignsRawData) {
      base.campaigns = campaignsRawData.map((campaign: ICampaign) => ({
        label: campaign.name,
        value: campaign.id,
        campaignId: campaign.campaignId,
      }));
    }

    if (validationData?.data) {
      base.validationTemplates = validationData.data.map((item: any) => ({
        label: item.name,
        value: item.id,
        tenant: item.tenant,
      }));
    }

    return base;
  }, [prefilledListsData, campaignsRawData, validationData]);

  useEffect(() => {
    // If only one marketer, auto-select and disable
    if (lists.marketers && lists.marketers.length === 1) {
      const marketer = lists.marketers[0];
      form.setFieldsValue({
        marketer: marketer.label,
        marketerCode: marketer.tenantCode,
        tenantCode: marketer.tenantCode,
      });
      setDisabledFields((prev) => ({
        ...prev,
        marketer: true,
        marketerCode: true,
        tenantCode: true,
      }));
      previousMarketerCode.current = marketer.tenantCode;
      // Campaigns and validation templates are fetched reactively via TanStack Query
      return;
    }

    // If marketerCode changes, update related fields and fetch campaigns/settings
    if (
      marketerCode &&
      previousMarketerCode.current !== marketerCode &&
      lists.marketers?.length
    ) {
      previousMarketerCode.current = marketerCode;

      form.setFieldsValue({
        campaignId: undefined,
        campaignName: undefined,
        campaignIdNumber: undefined,
      });

      const selectedMarketer = lists.marketers.find(
        (marketer) => marketer.tenantCode === marketerCode,
      );

      if (selectedMarketer) {
        form.setFieldsValue({
          marketer: selectedMarketer.label,
          tenantCode: selectedMarketer.tenantCode,
        });
      }

      // Campaigns and validation templates are fetched reactively via TanStack Query
    }
  }, [lists.marketers, marketerCode, form]);

  // Watch for pacingSchedule changes to handle Uncapped
  useEffect(() => {
    if (pacingSchedule === Pacing.UNCAPPED) {
      // Clear customPacingData when switching to Uncapped
      const currentCustomPacingData = form.getFieldValue('customPacingData');
      if (currentCustomPacingData && currentCustomPacingData.length > 0) {
        form.setFieldValue('customPacingData', []);
      }
    }
  }, [pacingSchedule, form]);

  // Watch for pacing type changes to clear data when switching to No Pacing
  useEffect(() => {
    if (pacingType === PacingType.NO_PACING) {
      // Clear all pacing-related fields when pacing type is No Pacing
      form.setFieldsValue({
        pacingSchedule: null, // Use null instead of undefined for form fields
        customPacingData: [],
        allowOverflow: false,
        deficitManagement: false, // Clear deficit management for No Pacing
      });
      // Immediately trigger change detection to avoid API calls with stale data
      setHasChanges(true);
    }
  }, [pacingType, form]);

  useEffect(() => {
    if (lineItemDetails?.campaign?.id && lists.campaigns?.length) {
      const matched = lists.campaigns.find(
        (campaign) => campaign.value === lineItemDetails?.campaign?.id,
      );
      if (matched) {
        form.setFieldsValue({
          campaignId: matched.value,
          campaignName: matched.label,
          campaignIdNumber: matched.campaignId,
        });
      }
    }
  }, [lists.campaigns, lineItemDetails?.campaign?.id]);

  useEffect(() => {
    const selectedCampaign = lists.campaigns?.find(
      (campaign) => campaign.value === allFields?.campaignId,
    );

    if (selectedCampaign) {
      form.setFieldsValue({
        campaignName: selectedCampaign.label,
        campaignIdNumber: selectedCampaign.campaignId,
      });
    }
  }, [allFields?.campaignId, lists.campaigns]);

  useEffect(() => {
    if (lineItemDetails && lineItemId) {
      const formattedLineItemDetails = formatLineItemFormData(lineItemDetails);
      const formattedDates = {
        lineItemTargetStartDate:
          formattedLineItemDetails?.lineItemTargetStartDate
            ? dayjs(formattedLineItemDetails?.lineItemTargetStartDate)
            : null,
        lineItemTargetEndDate: formattedLineItemDetails?.lineItemTargetEndDate
          ? dayjs(formattedLineItemDetails?.lineItemTargetEndDate)
          : null,
        createdAt: formattedLineItemDetails?.createdAt
          ? dayjs(formattedLineItemDetails?.createdAt)
          : null,
        updatedAt: formattedLineItemDetails?.updatedAt
          ? dayjs(formattedLineItemDetails?.updatedAt)
          : null,
        actualEndDate: formattedLineItemDetails?.actualEndDate
          ? dateObject(formattedLineItemDetails?.actualEndDate)
          : null,
        actualStartDate: formattedLineItemDetails?.actualStartDate
          ? dateObject(formattedLineItemDetails?.actualStartDate)
          : null,
        targetDeliveryStartDate:
          formattedLineItemDetails?.targetDeliveryStartDate
            ? dateObject(formattedLineItemDetails?.targetDeliveryStartDate)
            : null,
      };
      const prefilledFields = {
        ...formattedLineItemDetails,
        campaignId: formattedLineItemDetails?.campaign?.id,
        campaignName: formattedLineItemDetails?.campaign?.name,
        campaignIdNumber: formattedLineItemDetails?.campaign?.campaignId,
        marketer: formattedLineItemDetails?.marketer ?? undefined,
        marketerCode: formattedLineItemDetails?.marketerCode ?? undefined,
        tenantCode: formattedLineItemDetails?.tenantCode ?? undefined,
        pacingSchedule: formattedLineItemDetails?.pacingSchedule,
        customPacingData: formattedLineItemDetails?.customPacingData,
        // Explicitly include pacing-related boolean fields with default values
        allowOverflow:
          (formattedLineItemDetails as any)?.allowOverflow ?? false,
        deficitManagement:
          (formattedLineItemDetails as any)?.deficitManagement ?? true,
        ...formattedDates,
      };
      form.setFieldsValue(prefilledFields);

      // Store original target end date for validation
      if (formattedLineItemDetails?.lineItemTargetEndDate) {
        setOriginalTargetEndDate(
          formattedLineItemDetails.lineItemTargetEndDate,
        );
      }
      if (formattedLineItemDetails?.hasBeenLive) {
        setIsLineItemBeenLive(formattedLineItemDetails?.hasBeenLive);
      }
      if (formattedLineItemDetails?.pacingDisabledPermanently) {
        setPacingDisabledPermanently(
          formattedLineItemDetails?.pacingDisabledPermanently,
        );
      }
      // Check if overflow was already enabled
      if ((formattedLineItemDetails as any)?.allowOverflow) {
        setOverflowDisabledPermanently(true);
      }
      if (formattedLineItemDetails?.pacing) {
        // Extract the pacing value from the object (it might be an IPicklistItem)
        const pacingValue =
          typeof formattedLineItemDetails.pacing === 'string'
            ? formattedLineItemDetails.pacing
            : (formattedLineItemDetails.pacing as any)?.value ||
              (formattedLineItemDetails.pacing as any)?.name;
        setOriginalPacingValue(pacingValue);
      }
      // Get date field restrictions based on status
      const restrictions = getDateFieldRestrictions(
        lineItemDetails?.status,
        formattedLineItemDetails?.lineItemTargetEndDate,
      );
      setDateFieldRestrictions(restrictions);

      const updatedDisabledFields = {
        marketerCode: true,
        marketer: true,
        tenantCode: true,
        campaignId: true,
        campaignName: true,
        campaignIdNumber: true,
        // Add date field restrictions
        lineItemTargetStartDate: !restrictions.canEditTargetStartDate,
        targetDeliveryStartDate: !restrictions.canEditTargetDeliveryStartDate,
      };
      setDisabledFields(updatedDisabledFields);
    }
  }, [lineItemDetails, lineItemId, form]);

  // // Update disabled fields when pacingDisabledPermanently changes
  // useEffect(() => {
  //   if (pacingDisabledPermanently) {
  //     setDisabledFields((prev) => ({
  //       ...prev,
  //       pacing: true,
  //     }));
  //   }
  // }, [pacingDisabledPermanently]);

  // Handle create mode - ensure date fields are editable
  useEffect(() => {
    if (!lineItemId) {
      // In create mode, get restrictions for new line item (no status)
      const restrictions = getDateFieldRestrictions();
      setDateFieldRestrictions(restrictions);

      // Ensure date fields are not disabled in create mode
      setDisabledFields((prev) => ({
        ...prev,
        lineItemTargetStartDate: !restrictions.canEditTargetStartDate, // Should be false (enabled)
        targetDeliveryStartDate: !restrictions.canEditTargetDeliveryStartDate, // Should be false (enabled)
      }));
    }
  }, [lineItemId]);

  const hasPacingChanged = (
    initial: Record<string, any>,
    current: Record<string, any>,
  ) => {
    const format = (val: any) =>
      val && dayjs(val).isValid() ? dayjs(val).format('YYYY-MM-DD') : '';

    return PACING_KEYS.some((key) => {
      const a = key.includes('Date') ? format(initial[key]) : initial[key];
      const b = key.includes('Date') ? format(current[key]) : current[key];
      return a !== b;
    });
  };

  const getChangedFields = (
    initialValues: Record<string, any>,
    currentValues: Record<string, any>,
  ) => {
    const cleanedInitial = Object.fromEntries(
      Object.entries(initialValues || {}).filter(
        ([key]) => !EXCLUDED_DATE_FIELDS.includes(key as LineItemFields),
      ),
    );

    const cleanedCurrent = Object.fromEntries(
      Object.entries(currentValues || {}).filter(
        ([key]) => !EXCLUDED_DATE_FIELDS.includes(key as LineItemFields),
      ),
    );

    const changedFields: Record<string, any> = {};

    const dateFormat = (val: any) =>
      val && dayjs(val).isValid() ? dayjs(val).format('YYYY-MM-DD') : '';

    const dateChanged = (field: string) =>
      dateFormat(cleanedInitial[field]) !== dateFormat(cleanedCurrent[field]);

    const isDifferent = (key: string) =>
      JSON.stringify(cleanedInitial[key]) !==
      JSON.stringify(cleanedCurrent[key]);

    for (const key of Object.keys(cleanedCurrent)) {
      if (DATE_FIELDS.includes(key as LineItemFields)) {
        if (dateChanged(key)) {
          changedFields[key] = cleanedCurrent[key];
        }
      } else if (key === 'assetFileIds') {
        const initialIds: string[] = Array.isArray(cleanedInitial[key])
          ? cleanedInitial[key]
          : [];

        const currentIds: string[] = Array.isArray(cleanedCurrent[key])
          ? cleanedCurrent[key]
              .map((file: any) =>
                typeof file === 'object' && file !== null ? file.id : file,
              )
              .filter((id: any) => typeof id === 'string')
          : [];

        const sortedInitial = [...initialIds].sort();
        const sortedCurrent = [...currentIds].sort();

        const arraysAreEqual =
          sortedInitial.length === sortedCurrent.length &&
          sortedInitial.every((id, index) => id === sortedCurrent[index]);

        if (!arraysAreEqual) {
          changedFields['assetFileIds'] = currentIds;
        }
      } else if (key === 'deliveryTemplateId') {
        const getId = (val: any) =>
          typeof val === 'object' && val !== null ? val.id : val;

        const initialId = getId(cleanedInitial[key]);
        const currentId = getId(cleanedCurrent[key]);

        if (initialId !== currentId) {
          if (currentId === null || currentId === undefined) {
            changedFields['deliveryTemplateFileDeleted'] = true;
          } else {
            changedFields['deliveryTemplateId'] = currentId;
          }
        }
      } else if (key === 'allowOverflow' || key === 'deficitManagement') {
        // For boolean fields, ensure proper comparison
        const initialValue = cleanedInitial[key] ?? false;
        const currentValue = cleanedCurrent[key] ?? false;
        if (initialValue !== currentValue) {
          changedFields[key] = currentValue;
        }
      } else if (
        isObjectFieldWithValue(cleanedInitial[key]) ||
        isObjectFieldWithValue(cleanedCurrent[key])
      ) {
        // For fields that might be objects with value/name properties
        // Handle case where initial value might be an object {value: "Custom Pacing", name: "Custom Pacing"}
        // and current value is a string "Custom Pacing"
        const extractFieldValue = (val: any) => {
          if (!val) return '';
          if (typeof val === 'string') return val.trim();
          if (typeof val === 'object' && (val.value || val.name)) {
            return (val.value || val.name).trim();
          }
          return val.toString().trim();
        };

        const initialValue = extractFieldValue(cleanedInitial[key]);
        const currentValue = extractFieldValue(cleanedCurrent[key]);

        // Only add if actually different
        if (initialValue !== currentValue) {
          changedFields[key] = cleanedCurrent[key];
        }
      } else if (key === 'pacingSchedule') {
        // For pacingSchedule, treat null and empty string as equivalent
        const initialValue = cleanedInitial[key] || '';
        const currentValue = cleanedCurrent[key] || '';
        const normalizedInitial =
          initialValue === null || initialValue === '' ? '' : initialValue;
        const normalizedCurrent =
          currentValue === null || currentValue === '' ? '' : currentValue;
        if (normalizedInitial !== normalizedCurrent) {
          changedFields[key] = currentValue;
        }
      } else if (key === 'customPacingData') {
        // For customPacingData, do deep comparison
        const initialData = cleanedInitial[key] || [];
        const currentData = cleanedCurrent[key] || [];
        if (JSON.stringify(initialData) !== JSON.stringify(currentData)) {
          changedFields[key] = currentData;
        }
      } else if (isDifferent(key)) {
        changedFields[key] = cleanedCurrent[key];
      }
    }

    const pacingChanged = PACING_KEYS.some(
      (key) => dateChanged(key as string) || isDifferent(key as string),
    );

    if (!pacingChanged) {
      delete changedFields['pacingSchedule'];
    }
    return changedFields;
  };

  const handleUpdateLineItem = async (
    changedFields: Record<string, any>,
    id: string,
  ) => {
    // changedFields is already filtered for changes, no need to recalculate
    if (Object.keys(changedFields).length > 0) {
      const data = await updateMutation.mutateAsync({
        data: sanitizeData(changedFields),
        lineItemId: id,
      });
      if (data?.data) {
        onCreateSuccess?.(data.data.id);
        // Notify parent to fetch fresh data after update
        if (onUpdateSuccess) {
          onUpdateSuccess(data.data);
        }
        handleStepperChange && nextStep && handleStepperChange(nextStep);
      } else {
        showNotification({ message: data?.message, type: 'error' });
      }
    } else {
      // No changes detected, just move to next step without API call
      handleStepperChange && nextStep && handleStepperChange(nextStep);
    }
  };

  const handleCreateLineItem = async (values: Record<string, any>) => {
    const data = await createMutation.mutateAsync(sanitizeData(values));
    if (data?.data) {
      onCreateSuccess?.(data.data.id);
    } else {
      showNotification({ message: data?.message, type: 'error' });
    }
  };

  const validateDates = () => {
    const values = form.getFieldsValue();
    const targetStartDate = values?.lineItemTargetStartDate
      ? dayjs(values.lineItemTargetStartDate)
      : null;
    const targetEndDate = values?.lineItemTargetEndDate
      ? dayjs(values.lineItemTargetEndDate)
      : null;
    const targetDeliveryStartDate = values?.targetDeliveryStartDate
      ? dayjs(values.targetDeliveryStartDate)
      : null;

    const errors: any = {};
    const today = dayjs().startOf('day');

    // Check for required date fields
    if (!targetStartDate || !dayjs(values?.lineItemTargetStartDate).isValid()) {
      errors.lineItemTargetStartDate = 'Target Start Date is required';
    }

    if (!targetEndDate || !dayjs(values?.lineItemTargetEndDate).isValid()) {
      errors.lineItemTargetEndDate = 'Target End Date is required';
    }

    // Check if Target End Date is after Target Start Date
    if (targetStartDate && targetEndDate) {
      if (
        targetEndDate.isSame(targetStartDate, 'day') ||
        targetEndDate.isBefore(targetStartDate, 'day')
      ) {
        errors.lineItemTargetEndDate =
          'Target End Date must be after Target Start Date';
      }
    }

    // Check if Target End Date is after Target Delivery Start Date
    if (targetDeliveryStartDate && targetEndDate) {
      if (
        targetEndDate.isSame(targetDeliveryStartDate, 'day') ||
        targetEndDate.isBefore(targetDeliveryStartDate, 'day')
      ) {
        errors.lineItemTargetEndDate =
          'Target End Date must be after Target Delivery Start Date';
      }
    }

    // Check if Target Delivery Start Date is on or after Target Start Date
    if (targetStartDate && targetDeliveryStartDate) {
      if (targetDeliveryStartDate.isBefore(targetStartDate, 'day')) {
        errors.targetDeliveryStartDate =
          'Target Delivery Start Date cannot be before Target Start Date';
      }

      // Check if Target Delivery Start Date is within 90 days of Target Start Date
      const maxDeliveryDate = targetStartDate.add(90, 'day');
      if (targetDeliveryStartDate.isAfter(maxDeliveryDate, 'day')) {
        errors.targetDeliveryStartDate =
          'Target Delivery Start Date must be within 90 days of Target Start Date';
      }
    }

    // Apply status-based date restrictions for existing line items
    if (lineItemId && lineItemDetails?.status) {
      // For Target End Date - check if it can only be extended
      if (
        targetEndDate &&
        !isValidTargetEndDate(
          targetEndDate,
          originalTargetEndDate,
          lineItemDetails.status,
        )
      ) {
        errors.lineItemTargetEndDate = getDateValidationMessage(
          'targetEndDate',
          lineItemDetails.status,
          originalTargetEndDate,
        );
      }
    } else {
      // For new line items, no dates can be in the past
      if (targetStartDate && targetStartDate.isBefore(today, 'day')) {
        errors.lineItemTargetStartDate =
          'Target Start Date cannot be in the past';
      }
      if (targetEndDate && targetEndDate.isBefore(today, 'day')) {
        errors.lineItemTargetEndDate = 'Target End Date cannot be in the past';
      }
      if (
        targetDeliveryStartDate &&
        targetDeliveryStartDate.isBefore(today, 'day')
      ) {
        errors.targetDeliveryStartDate =
          'Target Delivery Start Date cannot be in the past';
      }
    }

    // Set field errors if any
    if (Object.keys(errors).length > 0) {
      const formErrors = Object.keys(errors).map((field) => ({
        name: field,
        errors: [errors[field]],
      }));
      form.setFields(formErrors);
      return false;
    }

    return true;
  };

  const handleFinish = async (values: Record<string, any>) => {
    try {
      // Clear any previous validation errors
      form.setFields([
        { name: 'lineItemTargetStartDate', errors: [] },
        { name: 'lineItemTargetEndDate', errors: [] },
        { name: 'targetDeliveryStartDate', errors: [] },
      ]);

      // Check if pacing fields changed without updating custom pacing data
      // Skip this check if allowOverflow is true since pacing can't be updated anyway
      const allowOverflow = form.getFieldValue('allowOverflow');
      if (
        pacingFieldsChanged &&
        pacingType === PacingType.CUSTOM_PACING &&
        !allowOverflow
      ) {
        const fieldsText =
          pacingChangedFields.length > 0
            ? pacingChangedFields.join(', ')
            : 'values';
        showNotification({
          message: `Please update the pacing strategy as ${fieldsText} ${pacingChangedFields.length > 1 ? 'have' : 'has'} changed`,
          type: 'error',
        });
        return;
      }

      // First validate all form fields including required ones
      await form.validateFields();

      // Then validate dates with our custom logic
      if (!validateDates()) {
        return;
      }

      // If no changes, just move to next step
      if (!hasChanges) {
        handleStepperChange && nextStep && handleStepperChange(nextStep);
        return;
      }

      setIsSubmitting(true);
    } catch (error) {
      // Form validation failed - fields will show their error messages
      return;
    }

    try {
      // Handle pacing data based on pacing type
      let pacingScheduleValue = values?.pacingSchedule || '';
      let customPacingDataValue = values?.customPacingData || [];
      let allowOverflowValue = values?.allowOverflow ?? false;
      let deficitManagementValue = values?.deficitManagement ?? true;

      // If pacing type is No Pacing, ensure correct values
      if (values?.pacing === PacingType.NO_PACING) {
        pacingScheduleValue = null;
        customPacingDataValue = [];
        allowOverflowValue = false;
        deficitManagementValue = false;
      }
      // If pacingSchedule is Uncapped, clear customPacingData
      else if (values?.pacingSchedule === Pacing.UNCAPPED) {
        customPacingDataValue = [];
      }

      const payload: Record<string, any> = {
        ...values,
        pacingSchedule: pacingScheduleValue,
        customPacingData: customPacingDataValue,
        // Explicitly include pacing-related boolean fields
        allowOverflow: allowOverflowValue,
        deficitManagement: deficitManagementValue,
        // Don't include these in payload - let getChangedFields determine if they changed
        lineItemTargetStartDate: values?.lineItemTargetStartDate
          ? formatDate(values?.lineItemTargetStartDate)
          : undefined,
        lineItemTargetEndDate: values?.lineItemTargetEndDate
          ? formatDate(values?.lineItemTargetEndDate)
          : undefined,
        targetDeliveryStartDate: values?.targetDeliveryStartDate
          ? formatDate(values?.targetDeliveryStartDate)
          : undefined,
        assetFileIds: values?.assetFileIds?.map((file: any) => file.id),
        deliveryTemplateId: values?.deliveryTemplateId?.id,
      };

      if (lineItemId && lineItemDetails) {
        // For updates, calculate changed fields using the proper function that handles pacing
        // formatLineItemFormData already transforms pacing correctly, but we need to add the missing fields
        const initialFormatted = {
          ...formatLineItemFormData(lineItemDetails),
          // Add pacing-related fields that formatLineItemFormData doesn't include
          allowOverflow: lineItemDetails.allowOverflow ?? false,
          deficitManagement: lineItemDetails.deficitManagement ?? false,
          customPacingData: lineItemDetails.customPacingData || [],
          pacingSchedule: lineItemDetails.pacingSchedule || '',
          // Add state tracking fields
          hasBeenLive: lineItemDetails.hasBeenLive ?? false,
          pacingDisabledPermanently:
            lineItemDetails.pacingDisabledPermanently ?? false,
          // pacing is already transformed by formatLineItemFormData
        };

        // Also add current state fields to payload for comparison
        const fullPayload = {
          ...payload,
          hasBeenLive: isLineItemBeenLive,
          pacingDisabledPermanently: pacingDisabledPermanently,
        };

        let changedFields = getChangedFields(initialFormatted, fullPayload);

        // Filter out pacing field if it's the same value (to avoid false positives)
        if (
          changedFields.pacing &&
          initialFormatted.pacing === (fullPayload as any).pacing
        ) {
          delete changedFields.pacing;
        }

        // SIMPLE RULE: Trust getChangedFields - it should only return what actually changed
        // Just handle special cases for pacing type changes

        // Special case: When pacing type changes to "No Pacing", force clear other pacing fields
        if (changedFields.pacing === PacingType.NO_PACING) {
          changedFields.pacingSchedule = null;
          changedFields.customPacingData = [];
          changedFields.allowOverflow = false;
          changedFields.deficitManagement = false;
        }
        // Special case: When pacing schedule changes to "Uncapped", clear customPacingData
        else if (changedFields.pacingSchedule === Pacing.UNCAPPED) {
          changedFields.customPacingData = [];
        }

        if (Object.keys(changedFields).length === 0) {
          // No changes detected, just move to next step
          handleStepperChange && nextStep && handleStepperChange(nextStep);
          setIsSubmitting(false);
          return;
        }
        await handleUpdateLineItem(changedFields, lineItemId);
      } else {
        // Create mode - send full payload including state fields
        const createPayload = {
          ...payload,
          hasBeenLive: isLineItemBeenLive,
          pacingDisabledPermanently: pacingDisabledPermanently,
        };
        await handleCreateLineItem(createPayload);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = debounce(handleFinish, 500);

  // Data fetching is now handled by TanStack Query hooks (prefilledListsData, campaignsRawData, validationData)

  useEffect(() => {
    if (lists?.validationTemplates?.length && !lineItemId) {
      const defaultTemplate = lists.validationTemplates.find(
        (item: any) => item.tenant?.code === 'DEFAULT',
      );
      if (defaultTemplate) {
        form.setFieldsValue({ validationSettingsId: defaultTemplate.value });
      }
    }
  }, [lists.validationTemplates, lineItemId]);

  const processedFields = processFieldPermissions(
    BasicDetailsSchema || [],
    disabledFields,
  );

  const groupedFields = processedFields.reduce(
    (acc, field) => {
      const group = field.group || 'default';
      if (!acc[group]) acc[group] = [];
      acc[group].push(field);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  // Prefill form with campaign data (create-from-campaign flow)
  useEffect(() => {
    if (campaignData && campaignUuid) {
      const campaignMarketerCode = campaignData.tenantCode;

      form.setFieldsValue({
        marketerCode: campaignMarketerCode,
        marketer: campaignData.marketer,
        tenantCode: campaignMarketerCode,
      });

      previousMarketerCode.current = campaignMarketerCode;

      const updatedDisabledFields = {
        marketerCode: !!campaignMarketerCode,
        marketer: !!campaignData.marketer,
        tenantCode: !!campaignMarketerCode,
        campaignId: !!campaignData.id,
        campaignName: !!campaignData.name,
        campaignIdNumber: !!campaignData.campaignId,
      };
      setDisabledFields(updatedDisabledFields);
    }
  }, [campaignData, campaignUuid]);

  // Match campaign from campaignData once campaigns list is available
  useEffect(() => {
    if (campaignData && lists.campaigns?.length) {
      const matchedCampaign = lists.campaigns.find(
        (c: { value: any }) => c.value === campaignData.id,
      );
      if (matchedCampaign) {
        form.setFieldsValue({
          campaignId: matchedCampaign.value,
          campaignName: matchedCampaign.label,
          campaignIdNumber: matchedCampaign.campaignId,
        });
      }
    }
  }, [lists.campaigns, campaignData]);

  // Handle pacing field change to open drawer when Custom Pacing is selected
  const handlePacingChange = (value: string) => {
    const currentPacing = form.getFieldValue('pacing');

    // Extract value if originalPacingValue is an object
    const originalPacingStringValue =
      typeof originalPacingValue === 'object'
        ? (originalPacingValue as any)?.value ||
          (originalPacingValue as any)?.name
        : originalPacingValue;

    // Check if trying to switch from Custom Pacing to No Pacing when line item has been live
    // Only show confirmation if the ORIGINAL pacing was Custom Pacing
    if (
      value === PacingType.NO_PACING &&
      originalPacingStringValue === PacingType.CUSTOM_PACING &&
      isLineItemBeenLive
    ) {
      setShowPacingConfirmation(true);
      // Don't update the form yet - wait for user confirmation
      form.setFieldValue('pacing', currentPacing);
      return;
    }

    // Check if trying to enable Custom Pacing when it's permanently disabled
    if (value === PacingType.CUSTOM_PACING && pacingDisabledPermanently) {
      // Silently revert without showing notification
      form.setFieldValue('pacing', PacingType.NO_PACING);
      return;
    }

    // Allow switching from No Pacing to Custom Pacing if original pacing was No Pacing
    // This is allowed even if hasBeenLive is true
    if (
      value === PacingType.CUSTOM_PACING &&
      originalPacingValue === PacingType.NO_PACING &&
      isLineItemBeenLive &&
      !pacingDisabledPermanently
    ) {
      // This is allowed - line item originally had No Pacing
      form.setFieldsValue({
        pacingSchedule: null,
        customPacingData: [],
        allowOverflow: false,
        deficitManagement: true,
      });
      setPacingDrawerOpen(true);
      return;
    }

    // Normal pacing change handling
    if (value === PacingType.CUSTOM_PACING) {
      // Before opening the drawer, check if previous pacing was "No Pacing"
      // If so, ensure all pacing data is cleared for a fresh start
      if (currentPacing === PacingType.NO_PACING) {
        // Clear any residual pacing data for a fresh start
        form.setFieldsValue({
          pacingSchedule: null,
          customPacingData: [],
          allowOverflow: false,
          deficitManagement: false,
        });
      }
      setPacingDrawerOpen(true);
    } else if (value === PacingType.NO_PACING) {
      // Immediately clear all pacing-related data when switching to No Pacing
      // This ensures the preview updates immediately and prevents API calls with stale data
      form.setFieldsValue({
        pacing: value, // Ensure the pacing type is set
        pacingSchedule: null, // Use null to clear the dropdown selection
        customPacingData: [],
        allowOverflow: false,
        deficitManagement: false, // Should be false for No Pacing
      });
      // Force update to prevent any pending API calls
      setHasChanges(true);
    }
  };

  // Detect changes in pacing configuration
  useEffect(() => {
    // For create scenario, always allow submission if there are values
    if (!lineItemId) {
      const hasValues = allFields?.name && allFields?.targetLeadGoal;
      setHasChanges(hasValues);
      return;
    }

    // For edit scenario, check for actual changes
    const hasFieldChanges = Object.keys(allFields || {}).some((key) => {
      if (lineItemDetails) {
        const initialValue = lineItemDetails[key as keyof ILineItem];
        return JSON.stringify(initialValue) !== JSON.stringify(allFields[key]);
      }
      return !!allFields[key];
    });

    // Check pacing configuration changes from form values
    const hasPacingConfigChanges =
      allFields?.pacingSchedule !== (lineItemDetails?.pacingSchedule || '') ||
      JSON.stringify(allFields?.customPacingData) !==
        JSON.stringify(lineItemDetails?.customPacingData || []);

    setHasChanges(hasFieldChanges || hasPacingConfigChanges);
  }, [allFields, lineItemDetails, lineItemId]);
  // Real-time date validation
  useEffect(() => {
    const targetStartDate = allFields?.lineItemTargetStartDate
      ? dayjs(allFields.lineItemTargetStartDate)
      : null;
    const targetEndDate = allFields?.lineItemTargetEndDate
      ? dayjs(allFields.lineItemTargetEndDate)
      : null;
    const targetDeliveryStartDate = allFields?.targetDeliveryStartDate
      ? dayjs(allFields.targetDeliveryStartDate)
      : null;

    const errors: string[] = [];

    // Validate Target End Date vs Target Start Date
    if (
      targetStartDate &&
      targetEndDate &&
      targetStartDate.isValid() &&
      targetEndDate.isValid()
    ) {
      if (
        targetEndDate.isSame(targetStartDate, 'day') ||
        targetEndDate.isBefore(targetStartDate, 'day')
      ) {
        errors.push('Target End Date must be after Target Start Date');
      }
    }

    // Validate Target End Date vs Target Delivery Start Date
    if (
      targetDeliveryStartDate &&
      targetEndDate &&
      targetDeliveryStartDate.isValid() &&
      targetEndDate.isValid()
    ) {
      if (
        targetEndDate.isSame(targetDeliveryStartDate, 'day') ||
        targetEndDate.isBefore(targetDeliveryStartDate, 'day')
      ) {
        errors.push('Target End Date must be after Target Delivery Start Date');
      }
    }

    // Set or clear errors
    if (errors.length > 0) {
      form.setFields([
        {
          name: LineItemFields.LineItemTargetEndDate,
          errors: errors,
        },
      ]);
    } else if (targetEndDate) {
      // Clear the error if dates are valid
      form.setFields([
        { name: LineItemFields.LineItemTargetEndDate, errors: [] },
      ]);
    }
  }, [
    allFields?.lineItemTargetStartDate,
    allFields?.lineItemTargetEndDate,
    allFields?.targetDeliveryStartDate,
    form,
  ]);

  const fetchInitialFileLists = async () => {
    if (!lineItemDetails) return;

    const assetFileIds = lineItemDetails.assetFileIds ?? [];
    let enrichedAssetFiles: UploadFile[] = [];

    if (
      Array.isArray(assetFileIds) &&
      assetFileIds.length > 0 &&
      !assetFileIds.every((id) => id === null)
    ) {
      const result = await fetchMultipleFileDetails(assetFileIds);
      enrichedAssetFiles = result?.data?.map((file: any) => ({
        ...file,
        id: file.id,
        uid: file.uid,
        name: file.filename,
        status: 'done',
      }));

      form.setFieldValue('assetFileIds', enrichedAssetFiles);
    }
    const deliveryTemplateId = lineItemDetails.deliveryTemplateId;

    if (typeof deliveryTemplateId === 'string') {
      const detail = await fetchFileDetails(deliveryTemplateId);

      if (detail?.id) {
        const enrichedDeliveryTemplate: UploadFile = {
          id: detail.id,
          uid: detail.id,
          name: detail.filename,
          status: 'done',
          ...detail,
        };

        form.setFieldValue('deliveryTemplateId', enrichedDeliveryTemplate);
      }
    }
  };

  useEffect(() => {
    fetchInitialFileLists();
  }, [lineItemDetails, form]);

  // Track initial pacing field values and monitor changes
  useEffect(() => {
    if (lineItemId && lineItemDetails && !initialPacingFieldValues) {
      // Store initial pacing-related field values
      const initialValues = {
        targetLeadGoal: lineItemDetails?.targetLeadGoal,
        lineItemTargetStartDate: lineItemDetails?.lineItemTargetStartDate,
        lineItemTargetEndDate: lineItemDetails?.lineItemTargetEndDate,
        targetDeliveryStartDate: lineItemDetails?.targetDeliveryStartDate,
        customPacingData: lineItemDetails?.customPacingData || [],
      };
      setInitialPacingFieldValues(initialValues);
    }
  }, [lineItemId, lineItemDetails, initialPacingFieldValues]);

  // Monitor changes to pacing-related fields
  useEffect(() => {
    // Skip validation if allowOverflow is true (pacing can't be updated anyway)
    const allowOverflow = allFields?.allowOverflow;

    if (
      !lineItemId ||
      !initialPacingFieldValues ||
      pacingType !== PacingType.CUSTOM_PACING ||
      allowOverflow // Skip if overflow is allowed
    ) {
      setPacingFieldsChanged(false);
      return;
    }

    const currentTargetLeadGoal = allFields?.targetLeadGoal;
    const currentTargetStartDate = allFields?.lineItemTargetStartDate;
    const currentTargetEndDate = allFields?.lineItemTargetEndDate;
    const currentDeliveryStartDate = allFields?.targetDeliveryStartDate;
    const currentCustomPacingData = allFields?.customPacingData || [];

    // Track which fields have changed for the message
    const changedFields = [];
    if (currentTargetLeadGoal !== initialPacingFieldValues.targetLeadGoal) {
      changedFields.push('Target Lead Goal');
    }
    if (
      formatDate(currentTargetStartDate) !==
      formatDate(initialPacingFieldValues.lineItemTargetStartDate)
    ) {
      changedFields.push('Target Start Date');
    }
    if (
      formatDate(currentTargetEndDate) !==
      formatDate(initialPacingFieldValues.lineItemTargetEndDate)
    ) {
      changedFields.push('Target End Date');
    }
    if (
      formatDate(currentDeliveryStartDate) !==
      formatDate(initialPacingFieldValues.targetDeliveryStartDate)
    ) {
      changedFields.push('Target Delivery Start Date');
    }

    const hasFieldsChanged = changedFields.length > 0;

    if (hasFieldsChanged && currentCustomPacingData.length > 0) {
      // Calculate total from customPacingData
      const totalLeadsRequired = currentCustomPacingData.reduce(
        (sum: number, period: any) => {
          return sum + (period.totalLeadsRequired || 0);
        },
        0,
      );

      // Check if sum matches target lead goal
      const targetLeadGoalNum = Number(currentTargetLeadGoal) || 0;
      const isValidPacing =
        Math.abs(totalLeadsRequired - targetLeadGoalNum) < 0.01; // Allow small rounding differences

      if (!isValidPacing) {
        setPacingFieldsChanged(true);
        // Store the changed fields for the notification message
        setPacingChangedFields(changedFields);
      } else {
        setPacingFieldsChanged(false);
        setPacingChangedFields([]);
      }
    } else {
      setPacingFieldsChanged(false);
      setPacingChangedFields([]);
    }
  }, [
    allFields?.targetLeadGoal,
    allFields?.lineItemTargetStartDate,
    allFields?.lineItemTargetEndDate,
    allFields?.targetDeliveryStartDate,
    allFields?.customPacingData,
    allFields?.allowOverflow, // Add allowOverflow to dependencies
    initialPacingFieldValues,
    lineItemId,
    pacingType,
  ]);

  const handleCancel = () => {
    router.push(`/campaign-management/line-items`);
  };

  // Handle pacing confirmation dialog
  const handlePacingConfirm = () => {
    // User confirmed - proceed with the change and disable pacing permanently
    setPacingDisabledPermanently(true);

    // Update form with No Pacing values
    form.setFieldsValue({
      pacing: PacingType.NO_PACING,
      pacingSchedule: null,
      customPacingData: [],
      allowOverflow: false,
      deficitManagement: false,
    });

    setHasChanges(true);
    setShowPacingConfirmation(false);
  };

  const handlePacingCancel = () => {
    // User cancelled - keep the pacing as Custom Pacing (they were trying to switch away but cancelled)
    form.setFieldValue('pacing', PacingType.CUSTOM_PACING);
    setShowPacingConfirmation(false);
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout='vertical'>
      <Row
        gutter={16}
        justify='start'
        style={{ paddingLeft: '0.5rem', marginBottom: '2rem' }}>
        <Text
          style={{
            color: '#464343',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          <Translate i18nKey='pages.lineItems.label.requiredInfo' />
        </Text>
      </Row>
      {Object.keys(groupedFields).map((group) => (
        <Row key={group} gutter={16}>
          {groupedFields[group]
            .sort(
              (a: { order: number }, b: { order: number }) => a.order - b.order,
            )
            .map((field: any, index: React.Key | null | undefined) => {
              if (field.hidden) {
                return (
                  <FormItem
                    key={index}
                    name={field.field}
                    className='input-control form-control-item'
                    hidden>
                    {renderField(
                      field,
                      lists,
                      form.getFieldValue('pacingSchedule'),
                      form,
                      marketerCode,
                      {
                        assetFiles: form.getFieldValue('assetFileIds'),
                        deliveryTemplateFile:
                          form.getFieldValue('deliveryTemplateId'),
                      },
                      dateFieldRestrictions,
                      form.getFieldValue('customPacingData'),
                      handlePacingChange,
                      allFields,
                      lineItemId,
                      (_data) => {
                        setHasChanges(true);
                        setPacingDrawerOpen(false);
                        // Reset pacing fields changed flag when data is saved
                        setPacingFieldsChanged(false);
                        // Update initial values with new custom pacing data
                        if (initialPacingFieldValues) {
                          setInitialPacingFieldValues({
                            ...initialPacingFieldValues,
                            customPacingData: _data.customPacingData || [],
                          });
                        }
                      },
                      async (changedData: any, id: string) => {
                        const result = await updateMutation.mutateAsync({
                          data: sanitizeData(changedData),
                          lineItemId: id,
                        });
                        // Notify parent to fetch fresh data
                        if (result?.data && onUpdateSuccess) {
                          onUpdateSuccess(result.data);
                        }
                        return result;
                      },
                      lineItemDetails,
                      pacingDisabledPermanently,
                      overflowDisabledPermanently,
                    )}
                  </FormItem>
                );
              }
              return (
                <Col key={index} span={field.span || 10}>
                  <FormItem
                    label={
                      field.fieldType === 'checkbox' ||
                      field.fieldType === 'pacingChart' ? (
                        ''
                      ) : field.tooltip ? (
                        <Space>
                          {field.label}{' '}
                          <Tooltip title={field.tooltip}>
                            <InfoCircleOutlined
                              style={{ color: '#8c8c8c', fontSize: '0.875rem' }}
                            />
                          </Tooltip>
                        </Space>
                      ) : (
                        field.label
                      )
                    }
                    name={field.field}
                    rules={field.rules || []}
                    className='input-control form-control-item'>
                    {renderField(
                      field,
                      lists,
                      form.getFieldValue('pacingSchedule'),
                      form,
                      marketerCode,
                      {
                        assetFiles: form.getFieldValue('assetFileIds'),
                        deliveryTemplateFile:
                          form.getFieldValue('deliveryTemplateId'),
                      },
                      dateFieldRestrictions,
                      form.getFieldValue('customPacingData'),
                      handlePacingChange,
                      allFields,
                      lineItemId,
                      (_data) => {
                        setHasChanges(true);
                        setPacingDrawerOpen(false);
                        // Reset pacing fields changed flag when data is saved
                        setPacingFieldsChanged(false);
                        // Update initial values with new custom pacing data
                        if (initialPacingFieldValues) {
                          setInitialPacingFieldValues({
                            ...initialPacingFieldValues,
                            customPacingData: _data.customPacingData || [],
                          });
                        }
                      },
                      async (changedData: any, id: string) => {
                        const result = await updateMutation.mutateAsync({
                          data: sanitizeData(changedData),
                          lineItemId: id,
                        });
                        // Notify parent to fetch fresh data
                        if (result?.data && onUpdateSuccess) {
                          onUpdateSuccess(result.data);
                        }
                        return result;
                      },
                      lineItemDetails,
                      pacingDisabledPermanently,
                      overflowDisabledPermanently,
                    )}
                  </FormItem>
                </Col>
              );
            })}
        </Row>
      ))}
      <Flex
        justify='end'
        gap='0.5rem'
        style={{ marginBottom: '3rem', marginRight: '2rem' }}>
        <Button onClick={handleCancel}>Cancel</Button>
        {isSubmitting ? (
          <LoaderButton />
        ) : (
          <Button htmlType='submit' type='primary'>
            {lineItemId ? 'Next' : 'Create & Next'}
          </Button>
        )}
      </Flex>
      <PacingChartDrawer
        lineItemId={lineItemId}
        open={pacingDrawerOpen}
        onClose={() => {
          setPacingDrawerOpen(false);
        }}
        pacing={allFields?.pacing}
        pacingSchedule={allFields?.pacingSchedule}
        customPacingData={allFields?.customPacingData || []}
        targetLeadGoal={
          allFields?.targetLeadGoal ? Number(allFields.targetLeadGoal) : 0
        }
        targetDeliveryStartDate={allFields?.targetDeliveryStartDate}
        lineItemTargetStartDate={allFields?.lineItemTargetStartDate}
        lineItemTargetEndDate={allFields?.lineItemTargetEndDate}
        pacingScheduleOptions={lists?.pacingSchedules || []}
        allowOverflow={allFields?.allowOverflow ?? false}
        deficitManagement={allFields?.deficitManagement ?? true}
        form={form}
        onPacingChange={(pacingValue) => {
          // Update pacing value in form when changed from HeaderConfiguration
          form.setFieldValue('pacing', pacingValue);
        }}
        lineItemStatus={
          typeof lineItemDetails?.status === 'string'
            ? lineItemDetails.status
            : lineItemDetails?.status?.value || lineItemDetails?.status?.name
        }
        isEditing={!!lineItemId}
        overflowDisabledPermanently={overflowDisabledPermanently}
        onOverflowEnable={() => {
          setOverflowDisabledPermanently(true);
          // Keep the current pacing selection when overflow is enabled
          const currentPacing = form.getFieldValue('pacing');
          const currentSchedule = form.getFieldValue('pacingSchedule');
          const currentCustomData = form.getFieldValue('customPacingData');

          form.setFieldsValue({
            pacing: currentPacing, // Keep whatever pacing is selected
            pacingSchedule: currentSchedule, // Keep the current schedule
            customPacingData: currentCustomData, // Keep the custom data
            allowOverflow: true,
            deficitManagement: false,
          });
          setPacingDisabledPermanently(true);
          setHasChanges(true);
        }}
        onDateChange={(startDate, endDate) => {
          // Update form dates when changed in pacing drawer
          form.setFieldsValue({
            targetDeliveryStartDate: startDate, // Keep as dayjs object
            lineItemTargetEndDate: endDate, // Keep as dayjs object
          });
          // Clear any validation errors on these fields
          form.setFields([
            { name: 'targetDeliveryStartDate', errors: [] },
            { name: 'lineItemTargetEndDate', errors: [] },
          ]);
          // Mark as having changes
          setHasChanges(true);
        }}
        onApiSave={async (changedData: any, id: string) => {
          const result = await updateMutation.mutateAsync({
            data: sanitizeData(changedData),
            lineItemId: id,
          });

          // After successful save, update the form with the latest data
          if (result?.data) {
            // If the API returns the full updated object, use that
            // Otherwise, merge the changed data with current form values
            const currentFormValues = form.getFieldsValue();
            const updatedFormValues = result.data.id
              ? // API returned full object - format it and use it
                { ...currentFormValues, ...formatLineItemFormData(result.data) }
              : // API returned partial data - merge with current values
                { ...currentFormValues, ...changedData };

            form.setFieldsValue(updatedFormValues);

            // Mark that changes have been made to trigger re-render of components
            setHasChanges(true);

            // Notify parent component about the update so it can refresh its data
            if (onUpdateSuccess && result.data.id) {
              onUpdateSuccess(result.data);
            }
          }

          return result;
        }}
        originalData={{
          ...lineItemDetails,
        }}
        onSave={(_data) => {
          setHasChanges(true);
          setPacingDrawerOpen(false);
          // Reset pacing fields changed flag when data is saved from main drawer
          setPacingFieldsChanged(false);
          // Update initial values with new custom pacing data
          if (initialPacingFieldValues) {
            setInitialPacingFieldValues({
              ...initialPacingFieldValues,
              customPacingData: _data.customPacingData || [],
            });
          }
        }}
      />
      <PacingChangeConfirmation
        visible={showPacingConfirmation}
        onConfirm={handlePacingConfirm}
        onCancel={handlePacingCancel}
      />
    </Form>
  );
};

// Helper function to detect if a field might be an object with value/name properties
const isObjectFieldWithValue = (value: any): boolean => {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    (value.hasOwnProperty('value') || value.hasOwnProperty('name'))
  );
};
