import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { debounce } from 'lodash';
import { Drawer, Alert, Text } from '@/components/uicomponents';
import { Title } from '@/components/uicomponents';
import { Flex } from '@/components/uicomponents/layout/flex';
import { Space } from '@/components/uicomponents/layout/space';
import { WarningOutlined } from '@/components/uicomponents/icons';
import { useWatch } from '@/components/uicomponents/form';
import dayjs, { Dayjs } from 'dayjs';
import { Pacing } from '../../lib/enums/pacing.enum';
import {
  fetchPacingSchedule,
  type PacingPeriod,
  type FetchPacingScheduleParams,
} from '../../services/fetch-pacing-schedule';
import { updateLineItem } from '../../services/update-line-item';
import { getChangedData } from '../../../lib/utils/get-changed-data';
import {
  PacingChartHeader,
  PacingTableSection,
  PacingModals,
  PacingDrawerFooter,
} from './pacing-chart-drawer/components';
import { getDateFieldRestrictions } from '../../lib/utils/date-field-restrictions';
import styles from './pacing-chart-drawer.module.css';
import { LineItemFields, PacingType } from '../../lib/enums';
// ============= MAIN COMPONENT =============
interface PacingChartDrawerProps {
  lineItemId?: string;
  open: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  onApiSave?: (changedData: any, id: string) => Promise<any>; // Add API save function from parent
  pacing?: string;
  initialData?: any;
  pacingSchedule?: string;
  customPacingData?: PacingPeriod[];
  targetLeadGoal?: number;
  targetDeliveryStartDate?: string | Dayjs;
  lineItemTargetStartDate?: string | Dayjs; // Target Start Date for date validation
  lineItemTargetEndDate?: string | Dayjs;
  onDateChange?: (startDate: Dayjs, endDate: Dayjs) => void;
  onPacingChange?: (pacing: string) => void;
  pacingScheduleOptions?: Array<{ value: string; label: string }>;
  form?: any; // Add form prop to update form fields directly
  isPreviewMode?: boolean; // Add flag for preview mode
  originalData?: any; // Add original line item data for change detection
  allowOverflow?: boolean;
  deficitManagement?: boolean;
  lineItemStatus?: string;
  isEditing?: boolean;
  overflowDisabledPermanently?: boolean;
  onOverflowEnable?: () => void;
}
export const PacingChartDrawer: React.FC<PacingChartDrawerProps> = ({
  lineItemId,
  open,
  onClose,
  onSave,
  onApiSave,
  pacing,
  pacingSchedule: propPacingSchedule,
  customPacingData,
  targetLeadGoal: propTargetLeadGoal,
  targetDeliveryStartDate: propTargetDeliveryStartDate,
  lineItemTargetStartDate: propLineItemTargetStartDate,
  lineItemTargetEndDate: propTargetEndDate,
  onDateChange,
  onPacingChange,
  pacingScheduleOptions = [],
  form,
  isPreviewMode = false,
  originalData,
  allowOverflow,
  deficitManagement,
  overflowDisabledPermanently = false,
  onOverflowEnable,
}) => {
  // ============= STATE MANAGEMENT =============
  const [pacingSchedule, setPacingSchedule] = useState<string>(
    propPacingSchedule || '',
  );
  const [targetLeadGoal, setTargetLeadGoal] = useState(propTargetLeadGoal || 0);
  const [loading, setLoading] = useState(false);
  const [hideZeroLeadCount, setHideZeroLeadCount] = useState(false);
  const [showBlockingAlert, setShowBlockingAlert] = useState(false);
  const [allocationDifference] = useState(0);
  const [editedData, setEditedData] = useState<PacingPeriod[]>([]);
  // Initialize with null, will be set from props when needed
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  // Track local overflow disabled state for immediate UI updates
  const [localOverflowDisabled, setLocalOverflowDisabled] = useState(
    overflowDisabledPermanently,
  );

  // Sync with prop changes
  useEffect(() => {
    setLocalOverflowDisabled(overflowDisabledPermanently);
  }, [overflowDisabledPermanently]);

  // Also check allowOverflow prop on mount/change - only for edit mode
  useEffect(() => {
    // Only set overflow disabled in edit mode when allowOverflow is true
    // In create mode, this should not affect the editing capability
    if (allowOverflow && lineItemId) {
      setLocalOverflowDisabled(true);
    }
  }, [allowOverflow, lineItemId]);

  // Local handler for overflow enable that updates local state immediately
  const handleLocalOverflowEnable = useCallback(() => {
    setLocalOverflowDisabled(true);
    onOverflowEnable?.();
  }, [onOverflowEnable]);

  // Track original data for change detection
  const [originalPacingData, setOriginalPacingData] = useState<any>(null);
  // Track if dates were changed via the modal
  const [datesChanged, setDatesChanged] = useState(false);
  // Add a ref to track if we've already set editedData for current customPacingData
  const lastCustomPacingDataRef = useRef<string>('');

  // Track previous field values for create mode change detection
  const previousFieldValuesRef = useRef<{
    targetLeadGoal?: number;
    targetDeliveryStartDate?: string;
    lineItemTargetEndDate?: string;
    lineItemTargetStartDate?: string;
    customPacingData?: PacingPeriod[];
    pacingSchedule?: string;
  }>({});

  // Create debounced version of fetchPacingData for Target Lead Goal changes
  const debouncedFetchPacingDataRef = useRef<any>(null);

  // Flag to prevent concurrent API calls
  const isFetchingRef = useRef(false);

  // Watch form fields if in create mode to detect changes
  const watchedTargetLeadGoal = useWatch('targetLeadGoal', form);
  const watchedTargetDeliveryStartDate = useWatch(
    'targetDeliveryStartDate',
    form,
  );
  const watchedLineItemTargetEndDate = useWatch('lineItemTargetEndDate', form);
  const watchedLineItemTargetStartDate = useWatch(
    'lineItemTargetStartDate',
    form,
  );

  // ============= COMPUTED VALUES =============
  const currentTotal = useMemo(() => {
    // For Daily pacing or any pacing with schedules, calculate from actual schedule values
    let total = 0;
    editedData.forEach((period) => {
      if (period.schedules && period.schedules.length > 0) {
        // If period has schedules, sum up the schedule values
        period.schedules.forEach((schedule) => {
          total += schedule.LeadsCount || 0;
        });
      } else {
        // If no schedules, use the period's LeadsCount
        total += period.LeadsCount || 0;
      }
    });
    return total;
  }, [editedData, targetLeadGoal]);

  // Check if any week has a mismatch between child total and parent target
  const hasAnyWeekMismatch = useMemo(() => {
    if (!editedData || editedData.length === 0) return false;

    // Check each period/week for mismatches
    return editedData.some((period) => {
      if (period.schedules && period.schedules.length > 0) {
        const childTotal = period.schedules.reduce(
          (sum, schedule) => sum + (schedule.LeadsCount || 0),
          0,
        );
        // If child total doesn't match parent target, we have a mismatch
        return childTotal !== period.LeadsCount;
      }
      return false;
    });
  }, [editedData]);
  // ============= FETCH PACING DATA =============
  const fetchPacingData = useCallback(
    async (forceFetch = false, overrides: any = {}) => {
      // Prevent concurrent API calls
      if (isFetchingRef.current && !forceFetch) {
        return;
      }

      // Use override dates if provided, otherwise use state dates
      const currentDateRange = overrides.dateRange || dateRange;

      if (!currentDateRange) {
        setEditedData([]);
        return;
      }

      // Validate date range before proceeding
      if (currentDateRange && currentDateRange.length === 2) {
        const [startDate, endDate] = currentDateRange;
        if (endDate.isBefore(startDate, 'day')) {
          setEditedData([]);
          return;
        }
      }

      // Don't fetch data if target lead goal is not provided or is 0
      const currentTargetLeadGoal = overrides.targetLeadGoal || targetLeadGoal;
      if (!currentTargetLeadGoal || currentTargetLeadGoal <= 0) {
        setEditedData([]);
        return;
      }

      const currentPacingSchedule = overrides.pacingSchedule || pacingSchedule;

      // Don't fetch data for uncapped pacing or empty pacing schedule
      if (currentPacingSchedule === Pacing.UNCAPPED || !currentPacingSchedule) {
        setEditedData([]);
        return;
      }

      // In create mode, check if key fields have changed
      if (!lineItemId && !forceFetch) {
        // Use overrides first, then watched values, then props
        const currentFieldValues = {
          targetLeadGoal:
            overrides.targetLeadGoal ||
            targetLeadGoal ||
            watchedTargetLeadGoal ||
            propTargetLeadGoal,
          targetDeliveryStartDate: overrides.dateRange
            ? overrides.dateRange[0].format('YYYY-MM-DD')
            : currentDateRange
              ? currentDateRange[0].format('YYYY-MM-DD')
              : '',
          lineItemTargetEndDate: overrides.dateRange
            ? overrides.dateRange[1].format('YYYY-MM-DD')
            : currentDateRange
              ? currentDateRange[1].format('YYYY-MM-DD')
              : '',
          lineItemTargetStartDate: watchedLineItemTargetStartDate
            ? dayjs(watchedLineItemTargetStartDate).format('YYYY-MM-DD')
            : propLineItemTargetStartDate
              ? dayjs(propLineItemTargetStartDate).format('YYYY-MM-DD')
              : '',
          pacingSchedule: currentPacingSchedule,
        };

        // Check if this is the first time setting values
        const isFirstSetup = !previousFieldValuesRef.current.pacingSchedule;

        // Check if pacing schedule has changed (always fetch if it has)
        const hasPacingScheduleChanged =
          previousFieldValuesRef.current.pacingSchedule !==
          currentFieldValues.pacingSchedule;

        // Compare with previous values for other fields
        const hasOtherFieldsChanged =
          previousFieldValuesRef.current.targetLeadGoal !==
            currentFieldValues.targetLeadGoal ||
          previousFieldValuesRef.current.targetDeliveryStartDate !==
            currentFieldValues.targetDeliveryStartDate ||
          previousFieldValuesRef.current.lineItemTargetEndDate !==
            currentFieldValues.lineItemTargetEndDate ||
          previousFieldValuesRef.current.lineItemTargetStartDate !==
            currentFieldValues.lineItemTargetStartDate;

        // If first setup or pacing schedule changed, always fetch
        if (isFirstSetup || hasPacingScheduleChanged) {
          previousFieldValuesRef.current = {
            ...currentFieldValues,
            customPacingData: [],
          };
          // Continue to fetch data
        }
        // If other fields changed, fetch again
        else if (hasOtherFieldsChanged) {
          // Don't update ref here - let the successful fetch do it
          // Continue to fetch data
        }
        // If no fields changed and we have existing custom pacing data, use it
        else if (
          !hasOtherFieldsChanged &&
          customPacingData &&
          customPacingData.length > 0
        ) {
          setEditedData(JSON.parse(JSON.stringify(customPacingData)));
          return;
        }
      }

      // Use existing customPacingData when:
      // 1. It exists and has data
      // 2. We're not forcing a fetch
      // 3. In preview mode with existing data OR in edit mode
      if (
        customPacingData &&
        customPacingData.length > 0 &&
        !forceFetch &&
        lineItemId
      ) {
        setEditedData(JSON.parse(JSON.stringify(customPacingData)));
        return;
      }
      setLoading(true);
      isFetchingRef.current = true;
      try {
        // Format lineItemTargetStartDate properly from the prop
        let formattedLineItemTargetStartDate: string = '';
        if (propLineItemTargetStartDate) {
          if (typeof propLineItemTargetStartDate === 'string') {
            // If it's a string, parse it to dayjs and format
            formattedLineItemTargetStartDate = dayjs(
              propLineItemTargetStartDate,
            ).format('YYYY-MM-DD');
          } else if (dayjs.isDayjs(propLineItemTargetStartDate)) {
            // If it's already a dayjs object, format it
            formattedLineItemTargetStartDate =
              propLineItemTargetStartDate.format('YYYY-MM-DD');
          }
        }
        const params: FetchPacingScheduleParams = {
          lineItemId: lineItemId || '',
          targetDeliveryStartDate: currentDateRange[0].format('YYYY-MM-DD'),
          lineItemTargetStartDate: formattedLineItemTargetStartDate,
          lineItemTargetEndDate: currentDateRange[1].format('YYYY-MM-DD'),
          targetLeadGoal: currentTargetLeadGoal,
          pacingSchedule: currentPacingSchedule,
          pacing,
          allowOverflow: overrides.allowOverflow ?? allowOverflow ?? false,
          deficitManagement:
            overrides.deficitManagement ?? deficitManagement ?? true,
        };
        const data = await fetchPacingSchedule(params);
        if (data) {
          setEditedData(JSON.parse(JSON.stringify(data))); // Deep copy for editing

          // Update the ref with successful fetch values for create mode
          if (!lineItemId) {
            previousFieldValuesRef.current = {
              targetLeadGoal: currentTargetLeadGoal,
              targetDeliveryStartDate: currentDateRange[0].format('YYYY-MM-DD'),
              lineItemTargetEndDate: currentDateRange[1].format('YYYY-MM-DD'),
              lineItemTargetStartDate: formattedLineItemTargetStartDate,
              pacingSchedule: currentPacingSchedule,
              customPacingData: data,
            };

            // In create mode, handle the new data carefully
            if (form) {
              if (!open) {
                // Drawer is closed - store the new data in form for "Next" button
                // But keep the old data in our ref for mismatch detection when drawer opens
                form.setFieldsValue({
                  customPacingData: data,
                  targetLeadGoal: currentTargetLeadGoal,
                  // Store a flag to indicate data was auto-updated
                  pacingDataAutoUpdated: true,
                });
              } else {
                // Drawer is open, update both editedData and form
                setEditedData(JSON.parse(JSON.stringify(data)));
                form.setFieldsValue({
                  customPacingData: data,
                  targetLeadGoal: currentTargetLeadGoal,
                  pacingDataAutoUpdated: false,
                });
              }
            }
          }
        } else {
          setEditedData([]);
        }
      } catch (error) {
        setEditedData([]);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [
      dateRange,
      pacingSchedule,
      targetLeadGoal,
      customPacingData,
      pacing,
      allowOverflow,
      deficitManagement,
      isPreviewMode,
    ],
  );
  // ============= EVENT HANDLERS =============
  const handleLeadsCountChange = useCallback(
    (
      value: number | null | string,
      recordId: string,
      isParent: boolean = false,
    ) => {
      // Handle null/undefined/empty string as 0, ensure it's a number
      let numValue = 0;
      if (value !== null && value !== undefined && value !== '') {
        numValue = typeof value === 'number' ? value : Number(value);
        // Handle NaN case
        if (isNaN(numValue)) {
          numValue = 0;
        }
      }

      // Deep clone the data to ensure proper updates
      const newData = JSON.parse(JSON.stringify(editedData));

      // If we know this is a parent row (from the component that called this)
      if (isParent) {
        for (let i = 0; i < newData.length; i++) {
          if (newData[i].id === recordId) {
            const period = newData[i];
            // This is a parent period row - set it directly
            period.LeadsCount = numValue;

            // Only update children within this specific week/period
            // Redistribute the value among children proportionally
            if (period.schedules && period.schedules.length > 0) {
              if (numValue === 0) {
                // If value is 0, set all children to 0
                for (let j = 0; j < period.schedules.length; j++) {
                  period.schedules[j].LeadsCount = 0;
                }
              } else {
                // Redistribute proportionally, excluding past dates
                const today = dayjs().startOf('day');
                const editableSchedules = period.schedules.filter((s: any) => {
                  const scheduleDate = dayjs(s.date, 'YYYY-MM-DD').startOf(
                    'day',
                  );
                  return !scheduleDate.isBefore(today);
                });

                if (editableSchedules.length > 0) {
                  const perSchedule = Math.floor(
                    numValue / editableSchedules.length,
                  );
                  const remainder = numValue % editableSchedules.length;
                  let distributedCount = 0;
                  let remainderAssigned = 0;

                  for (let j = 0; j < period.schedules.length; j++) {
                    const schedule = period.schedules[j];
                    const scheduleDate = dayjs(
                      schedule.date,
                      'YYYY-MM-DD',
                    ).startOf('day');

                    if (scheduleDate.isBefore(today)) {
                      // Keep past dates unchanged
                      distributedCount += schedule.LeadsCount;
                    } else {
                      // Distribute among future dates
                      const editableIndex = editableSchedules.findIndex(
                        (s: any) => s.id === schedule.id,
                      );
                      if (editableIndex !== -1) {
                        schedule.LeadsCount =
                          perSchedule + (remainderAssigned < remainder ? 1 : 0);
                        if (remainderAssigned < remainder) remainderAssigned++;
                        distributedCount += schedule.LeadsCount;
                      }
                    }
                  }

                  // Adjust for locked past dates
                  if (distributedCount !== numValue) {
                    // Recalculate based on actual distribution
                    period.LeadsCount = distributedCount;
                  }
                } else {
                  // All dates are in the past, don't change anything
                  // Keep the original values
                }
              }
            }
            setEditedData(newData);
            return; // Exit early since we found and updated the parent
          }
        }
      }

      // First check if this is a schedule item (child row)
      let isScheduleItem = false;
      for (let i = 0; i < newData.length; i++) {
        const period = newData[i];
        if (period.schedules) {
          const scheduleIndex = period.schedules.findIndex(
            (s: any) => s.id === recordId,
          );
          if (scheduleIndex !== -1) {
            // Found it as a schedule item - update only this specific schedule
            const schedule = period.schedules[scheduleIndex];

            // Check if this date is in the past
            const today = dayjs().startOf('day');
            const scheduleDate = dayjs(schedule.date, 'YYYY-MM-DD').startOf(
              'day',
            );

            if (scheduleDate.isBefore(today)) {
              // Don't allow editing past dates
              return;
            }

            // Update only the child value, DO NOT update parent
            schedule.LeadsCount = numValue;
            // DO NOT recalculate parent total - parent should remain unchanged
            // period.LeadsCount stays the same
            isScheduleItem = true;
            break;
          }
        }
      }

      // If not found as a schedule item and not marked as parent, check if it's a period (parent row)
      if (!isScheduleItem && !isParent) {
        for (let i = 0; i < newData.length; i++) {
          if (newData[i].id === recordId) {
            const period = newData[i];
            // This is a parent period row
            period.LeadsCount = numValue;

            // Only update children within this specific week/period
            if (period.schedules && period.schedules.length > 0) {
              if (numValue === 0) {
                // If value is 0, set all children to 0
                for (let j = 0; j < period.schedules.length; j++) {
                  period.schedules[j].LeadsCount = 0;
                }
              } else {
                // Redistribute proportionally, excluding past dates
                const today = dayjs().startOf('day');
                const editableSchedules = period.schedules.filter((s: any) => {
                  const scheduleDate = dayjs(s.date, 'YYYY-MM-DD').startOf(
                    'day',
                  );
                  return !scheduleDate.isBefore(today);
                });

                if (editableSchedules.length > 0) {
                  const perSchedule = Math.floor(
                    numValue / editableSchedules.length,
                  );
                  const remainder = numValue % editableSchedules.length;
                  let remainderAssigned = 0;

                  for (let j = 0; j < period.schedules.length; j++) {
                    const schedule = period.schedules[j];
                    const scheduleDate = dayjs(
                      schedule.date,
                      'YYYY-MM-DD',
                    ).startOf('day');

                    if (!scheduleDate.isBefore(today)) {
                      schedule.LeadsCount =
                        perSchedule + (remainderAssigned < remainder ? 1 : 0);
                      if (remainderAssigned < remainder) remainderAssigned++;
                    }
                  }
                }
              }
            }
            break;
          }
        }
      }

      setEditedData(newData);

      // In create mode, immediately update form with changes
      if (!lineItemId && form) {
        form.setFieldsValue({
          customPacingData: newData,
          pacingDataAutoUpdated: false, // Clear flag since user is editing
        });
      }
    },
    [editedData, lineItemId, form],
  );
  const handleAutoAdjust = useCallback(() => {
    // Auto adjust updates the target lead goal to match current pacing total
    setTargetLeadGoal(currentTotal);

    // If we have a form, update it immediately
    if (form) {
      form.setFieldValue('targetLeadGoal', currentTotal);
    }
  }, [currentTotal, form]);

  const handlePeriodAutoAdjust = useCallback(
    (periodId: string, targetTotal: number) => {
      const newData = JSON.parse(JSON.stringify(editedData));
      const periodIndex = newData.findIndex(
        (p: PacingPeriod) => p.id === periodId,
      );

      if (periodIndex !== -1) {
        // Simply update the parent period's target to match the child total
        newData[periodIndex].LeadsCount = targetTotal;
        setEditedData(newData);
      }
    },
    [editedData],
  );

  const savePacingConfiguration = useCallback(
    async (updateTargetGoal = false) => {
      if (!form || !lineItemId) return;

      const targetGoal = updateTargetGoal ? currentTotal : targetLeadGoal;

      // For Uncapped, clear the customPacingData
      const pacingData = pacingSchedule === Pacing.UNCAPPED ? [] : editedData;

      // Get current form values
      const currentPacing = form.getFieldValue('pacing') ?? pacing;
      const currentAllowOverflow = form.getFieldValue('allowOverflow') ?? false;
      const currentDeficitManagement =
        form.getFieldValue('deficitManagement') ?? true;
      // Create current pacing data for comparison
      const currentPacingData = {
        pacing: currentPacing, // Use current form value
        pacingSchedule: pacingSchedule || '',
        customPacingData: pacingData || [],
        targetLeadGoal: targetGoal,
        targetDeliveryStartDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        lineItemTargetEndDate: dateRange?.[1]?.format('YYYY-MM-DD'),
        allowOverflow: currentAllowOverflow ?? false,
        deficitManagement: currentDeficitManagement ?? false,
      };

      // Update form fields - keep dates as dayjs objects for the form
      form.setFieldsValue({
        pacingSchedule: pacingSchedule,
        customPacingData: pacingData,
        targetLeadGoal: targetGoal,
        pacing: currentPacing, // Use current form value
        targetDeliveryStartDate: dateRange?.[0], // Keep as dayjs object
        lineItemTargetEndDate: dateRange?.[1], // Keep as dayjs object
        allowOverflow: currentAllowOverflow,
        deficitManagement: currentDeficitManagement,
      });

      // Check if there are any changes compared to original data
      if (originalPacingData) {
        const changedData = getChangedData(
          currentPacingData,
          originalPacingData,
        );

        // If dates were changed via the modal, always include them
        if (datesChanged) {
          changedData.targetDeliveryStartDate =
            dateRange?.[0]?.format('YYYY-MM-DD');
          changedData.lineItemTargetEndDate =
            dateRange?.[1]?.format('YYYY-MM-DD');
        }

        // If no changes detected, don't make API call
        if (Object.keys(changedData).length === 0) {
          return;
        }

        // Use parent's save function if provided, otherwise fallback to direct API call
        try {
          let response;
          if (onApiSave) {
            // Only send what actually changed - don't force include allowOverflow/deficitManagement
            // The changedData already contains only what changed
            response = await onApiSave(changedData, lineItemId);
          } else {
            // Fallback to direct API call with only changed fields
            const payloadWithCurrentState = {
              ...changedData,
              allowOverflow: form?.getFieldValue('allowOverflow') ?? false,
              deficitManagement:
                form?.getFieldValue('deficitManagement') ?? true,
            };
            response = await updateLineItem(
              payloadWithCurrentState,
              lineItemId,
            );
          }

          if (response?.data) {
            if (onSave) {
              const saveData = {
                pacing, // Include pacing field
                pacingSchedule,
                allowOverflow: form?.getFieldValue('allowOverflow') ?? false,
                deficitManagement:
                  form?.getFieldValue('deficitManagement') ?? true,
                targetLeadGoal: targetGoal,
                targetDeliveryStartDate: dateRange?.[0]?.format('YYYY-MM-DD'),
                lineItemTargetEndDate: dateRange?.[1]?.format('YYYY-MM-DD'),
                pacingData: pacingData,
                reloadRequired: true, // Signal that reload is needed after save
              };
              onSave(saveData);
            }

            setDatesChanged(false); // Reset the flag after successful save
            onClose();
          }
        } catch (error) {}
      } else {
        // If no original data to compare, save everything (fallback for safety)
        const allFormValues = form.getFieldsValue();
        const updatePayload = {
          ...allFormValues,
          ...currentPacingData,
        };

        try {
          const response = onApiSave
            ? await onApiSave(updatePayload, lineItemId)
            : await updateLineItem(updatePayload, lineItemId);

          if (response?.data) {
            onClose();
          } else {
          }
        } catch (error) {}
      }
    },
    [
      form,
      lineItemId,
      currentTotal,
      targetLeadGoal,
      pacingSchedule,
      editedData,
      dateRange,
      originalPacingData,
      originalData,
      getChangedData,
      onApiSave,
      onSave,
      onClose,
    ],
  );

  const handleSave = useCallback(() => {
    if (!dateRange) {
      return;
    }
    // Check if pacing schedule is selected
    if (!pacingSchedule) {
      return;
    }
    // Check if target lead goal is provided
    if (!targetLeadGoal || targetLeadGoal <= 0) {
      return;
    }

    // For Uncapped, clear the customPacingData
    const pacingData = pacingSchedule === Pacing.UNCAPPED ? [] : editedData;

    // Check for errors in both create and edit modes
    const hasParentError = currentTotal !== targetLeadGoal;

    // Prevent save if there's a parent error (overall total mismatch)
    if (
      pacingSchedule !== Pacing.UNCAPPED &&
      targetLeadGoal &&
      hasParentError
    ) {
      // Prevent save when overall total doesn't match
      return;
    }

    // For edit mode with lineItemId
    if (lineItemId) {
      // No parent error, proceed with save (child mismatches are allowed)
      savePacingConfiguration();
    } else {
      // Create mode - update form with user-adjusted data and close (no API call)
      if (form) {
        form.setFieldsValue({
          pacing: pacing, // Include pacing field
          pacingSchedule: pacingSchedule,
          customPacingData: pacingData, // This is the user-adjusted data from editedData
          targetLeadGoal: targetLeadGoal,
          lineItemTargetStartDate: propLineItemTargetStartDate,
          targetDeliveryStartDate: dateRange[0], // Keep as dayjs object
          lineItemTargetEndDate: dateRange[1], // Keep as dayjs object
          pacingDataAutoUpdated: false, // Clear flag since user manually saved
        });

        // Update our ref with the saved values for future comparisons
        previousFieldValuesRef.current = {
          targetLeadGoal: targetLeadGoal,
          targetDeliveryStartDate: dateRange[0].format('YYYY-MM-DD'),
          lineItemTargetEndDate: dateRange[1].format('YYYY-MM-DD'),
          lineItemTargetStartDate: propLineItemTargetStartDate
            ? typeof propLineItemTargetStartDate === 'string'
              ? dayjs(propLineItemTargetStartDate).format('YYYY-MM-DD')
              : propLineItemTargetStartDate.format('YYYY-MM-DD')
            : '',
          pacingSchedule: pacingSchedule,
          customPacingData: pacingData,
        };
      }

      if (onSave) {
        const saveData = {
          pacing, // Include pacing field
          pacingSchedule,
          allowOverflow: form?.getFieldValue('allowOverflow') ?? false,
          deficitManagement: form?.getFieldValue('deficitManagement') ?? true,
          targetLeadGoal,
          targetDeliveryStartDate: dateRange[0].format('YYYY-MM-DD'),
          lineItemTargetEndDate: dateRange[1].format('YYYY-MM-DD'),
          pacingData: pacingData,
        };
        onSave(saveData);
      }
      onClose();
    }
  }, [
    dateRange,
    currentTotal,
    targetLeadGoal,
    pacingSchedule,
    editedData,
    onSave,
    onClose,
    form,
    lineItemId,
    savePacingConfiguration,
  ]);
  const handleDrawerClose = useCallback(() => {
    // Check if there's a parent error (overall mismatch)
    const hasParentError =
      !!pacingSchedule &&
      pacingSchedule !== Pacing.UNCAPPED &&
      editedData.length > 0 &&
      targetLeadGoal > 0 &&
      currentTotal !== targetLeadGoal;

    // In create mode, prevent closing when there's a mismatch
    if (!lineItemId && hasParentError) {
      // Don't allow closing - user must fix the mismatch or click Save
      return;
    }

    // Check if there are unsaved changes in edit mode
    if (originalPacingData && lineItemId) {
      const pacingData = pacingSchedule === Pacing.UNCAPPED ? [] : editedData;
      const currentPacingData = {
        pacingSchedule: pacingSchedule,
        customPacingData: pacingData,
        targetLeadGoal: targetLeadGoal,
        targetDeliveryStartDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        lineItemTargetEndDate: dateRange?.[1]?.format('YYYY-MM-DD'),
        allowOverflow: form?.getFieldValue('allowOverflow') ?? false,
        deficitManagement: form?.getFieldValue('deficitManagement') ?? true,
      };

      const changedData = getChangedData(currentPacingData, originalPacingData);

      if (Object.keys(changedData).length > 0) {
        // There are unsaved changes in the drawer
        // Don't save the unsaved customPacingData but also don't reset any form fields
        // Just close the drawer without making any changes to the form

        // Reset drawer's internal state to match what's already in the form
        // This ensures next time drawer opens, it shows the correct data
        setPacingSchedule(
          form?.getFieldValue('pacingSchedule') ||
            originalPacingData.pacingSchedule ||
            '',
        );
        setEditedData(
          form?.getFieldValue('customPacingData') ||
            originalPacingData.customPacingData ||
            [],
        );
        setLocalOverflowDisabled(
          form?.getFieldValue('allowOverflow') ||
            originalPacingData.allowOverflow ||
            false,
        );

        // Don't change any form values - keep everything as is
        // The user's changes to dates, TLG etc. should remain intact
      }
    } else {
      // For create mode, save the current drawer state to the form when closing
      // This ensures the data is preserved even if user doesn't click Save
      if (form && !lineItemId) {
        // Save current drawer state to form so it's not lost
        const formUpdates: any = {};

        // Save pacing schedule and custom pacing data
        if (pacingSchedule) {
          formUpdates.pacingSchedule = pacingSchedule;
        }

        // Save custom pacing data (current edited data)
        if (editedData && editedData.length > 0) {
          formUpdates.customPacingData = editedData;
        }

        // Save target lead goal if changed
        if (targetLeadGoal && targetLeadGoal > 0) {
          formUpdates.targetLeadGoal = targetLeadGoal;
        }

        // Save date range if changed
        if (dateRange && dateRange[0] && dateRange[1]) {
          formUpdates.targetDeliveryStartDate = dateRange[0];
          formUpdates.lineItemTargetEndDate = dateRange[1];
        }

        // Save overflow and deficit management settings
        formUpdates.allowOverflow =
          form.getFieldValue('allowOverflow') ?? false;
        formUpdates.deficitManagement =
          form.getFieldValue('deficitManagement') ?? true;

        // Apply all updates to form
        if (Object.keys(formUpdates).length > 0) {
          form.setFieldsValue(formUpdates);
        }

        // Also notify parent component if onSave is provided
        if (onSave && pacingSchedule && dateRange) {
          const saveData = {
            pacing: form.getFieldValue('pacing'),
            pacingSchedule: pacingSchedule,
            customPacingData: editedData,
            targetLeadGoal: targetLeadGoal,
            targetDeliveryStartDate: dateRange[0].format('YYYY-MM-DD'),
            lineItemTargetEndDate: dateRange[1].format('YYYY-MM-DD'),
            allowOverflow: form.getFieldValue('allowOverflow') ?? false,
            deficitManagement: form.getFieldValue('deficitManagement') ?? true,
          };
          onSave(saveData);
        }
      }

      // Don't reset drawer state - keep everything as is for when it reopens
    }

    // Close the drawer and reset dates changed flag
    setDatesChanged(false);

    // Always update form with current editedData to preserve user changes
    if (form && editedData.length > 0) {
      form.setFieldsValue({
        customPacingData: editedData,
        targetLeadGoal: targetLeadGoal,
        pacingDataAutoUpdated: false, // Clear flag since user interacted with data
      });

      // Update our ref with current values for future comparisons
      if (!lineItemId) {
        previousFieldValuesRef.current = {
          ...previousFieldValuesRef.current,
          customPacingData: editedData,
          targetLeadGoal: targetLeadGoal,
        };
      }
    }

    onClose();
  }, [
    pacingSchedule,
    editedData,
    targetLeadGoal,
    currentTotal,
    dateRange,
    originalPacingData,
    lineItemId,
    form,
    onClose,
    onSave,
    pacing,
    getChangedData,
    hasAnyWeekMismatch,
    isPreviewMode,
  ]);

  const handleDateRangeChange = useCallback(
    (dates: any) => {
      if (dates && dates[0] && dates[1]) {
        setDateRange([dates[0], dates[1]]);
        setDatesChanged(true); // Mark that dates have been changed

        // Update form fields immediately with the new dates
        if (form) {
          form.setFieldsValue({
            targetDeliveryStartDate: dates[0], // Keep as dayjs object for form
            lineItemTargetEndDate: dates[1], // Keep as dayjs object for form
          });
        }

        onDateChange?.(dates[0], dates[1]);
        // Only fetch if pacing schedule is already selected
        // Pass the new dates directly to avoid async state issues
        if (pacingSchedule && targetLeadGoal > 0) {
          fetchPacingData(true, {
            dateRange: [dates[0], dates[1]],
            targetLeadGoal: targetLeadGoal,
          });
        }
      }
    },
    [onDateChange, pacingSchedule, targetLeadGoal, fetchPacingData, form],
  );
  // ============= EFFECTS =============
  // Initialize debounced function for Target Lead Goal changes
  useEffect(() => {
    debouncedFetchPacingDataRef.current = debounce((overrides: any) => {
      fetchPacingData(true, overrides);
    }, 500); // 800ms delay for Target Lead Goal changes

    // Cleanup on unmount
    return () => {
      if (debouncedFetchPacingDataRef.current) {
        debouncedFetchPacingDataRef.current.cancel();
      }
    };
  }, [fetchPacingData]);

  useEffect(() => {
    if (propTargetLeadGoal !== undefined && propTargetLeadGoal !== null) {
      setTargetLeadGoal(propTargetLeadGoal);
    }
  }, [propTargetLeadGoal]);

  // In create mode, auto-fetch when key fields change (even if drawer is closed)
  useEffect(() => {
    if (
      !lineItemId &&
      pacingSchedule &&
      customPacingData &&
      customPacingData.length > 0
    ) {
      // Get current field values from props/watched values
      const currentFieldValues = {
        targetLeadGoal: propTargetLeadGoal,
        targetDeliveryStartDate: propTargetDeliveryStartDate
          ? typeof propTargetDeliveryStartDate === 'string'
            ? dayjs(propTargetDeliveryStartDate).format('YYYY-MM-DD')
            : dayjs.isDayjs(propTargetDeliveryStartDate)
              ? propTargetDeliveryStartDate.format('YYYY-MM-DD')
              : ''
          : '',
        lineItemTargetEndDate: propTargetEndDate
          ? typeof propTargetEndDate === 'string'
            ? dayjs(propTargetEndDate).format('YYYY-MM-DD')
            : dayjs.isDayjs(propTargetEndDate)
              ? propTargetEndDate.format('YYYY-MM-DD')
              : ''
          : '',
        lineItemTargetStartDate: propLineItemTargetStartDate
          ? typeof propLineItemTargetStartDate === 'string'
            ? dayjs(propLineItemTargetStartDate).format('YYYY-MM-DD')
            : dayjs.isDayjs(propLineItemTargetStartDate)
              ? propLineItemTargetStartDate.format('YYYY-MM-DD')
              : ''
          : '',
      };

      // Check if we have previous values and if they changed
      if (previousFieldValuesRef.current.pacingSchedule === pacingSchedule) {
        // Same pacing schedule, check if other fields changed
        const hasFieldsChanged =
          previousFieldValuesRef.current.targetLeadGoal !==
            currentFieldValues.targetLeadGoal ||
          previousFieldValuesRef.current.targetDeliveryStartDate !==
            currentFieldValues.targetDeliveryStartDate ||
          previousFieldValuesRef.current.lineItemTargetEndDate !==
            currentFieldValues.lineItemTargetEndDate ||
          previousFieldValuesRef.current.lineItemTargetStartDate !==
            currentFieldValues.lineItemTargetStartDate;

        if (hasFieldsChanged && (currentFieldValues.targetLeadGoal ?? 0) > 0) {
          // Validate dates before proceeding
          const startDate = currentFieldValues.lineItemTargetStartDate
            ? dayjs(currentFieldValues.lineItemTargetStartDate)
            : null;
          const endDate = currentFieldValues.lineItemTargetEndDate
            ? dayjs(currentFieldValues.lineItemTargetEndDate)
            : null;
          const deliveryStartDate = currentFieldValues.targetDeliveryStartDate
            ? dayjs(currentFieldValues.targetDeliveryStartDate)
            : null;

          // Date validation checks
          let hasDateErrors = false;

          if (startDate && endDate) {
            // Check if end date is before start date
            if (endDate.isBefore(startDate, 'day')) {
              hasDateErrors = true;
            }

            // Check if delivery start date is after end date
            if (
              deliveryStartDate &&
              deliveryStartDate.isAfter(endDate, 'day')
            ) {
              hasDateErrors = true;
            }

            // Check if delivery start date is before start date
            if (
              deliveryStartDate &&
              deliveryStartDate.isBefore(startDate, 'day')
            ) {
              hasDateErrors = true;
            }
          }

          // Only proceed if no date errors
          if (!hasDateErrors) {
            // Fields changed, update state values that will trigger fetch
            setTargetLeadGoal(currentFieldValues.targetLeadGoal ?? 0);

            // Update date range if dates changed
            if (
              currentFieldValues.targetDeliveryStartDate &&
              currentFieldValues.lineItemTargetEndDate
            ) {
              const newStartDate = dayjs(
                currentFieldValues.targetDeliveryStartDate,
              );
              const newEndDate = dayjs(
                currentFieldValues.lineItemTargetEndDate,
              );
              setDateRange([newStartDate, newEndDate]);
            }

            // Update ref with new values
            previousFieldValuesRef.current = {
              ...currentFieldValues,
              pacingSchedule,
              customPacingData: [],
            };

            // Force fetch with new values
            if (propTargetDeliveryStartDate && propTargetEndDate) {
              const dateRange = [
                dayjs(propTargetDeliveryStartDate),
                dayjs(propTargetEndDate),
              ];

              // Check if only Target Lead Goal changed (use debouncing)
              const onlyTLGChanged =
                previousFieldValuesRef.current.targetLeadGoal !==
                  currentFieldValues.targetLeadGoal &&
                previousFieldValuesRef.current.targetDeliveryStartDate ===
                  currentFieldValues.targetDeliveryStartDate &&
                previousFieldValuesRef.current.lineItemTargetEndDate ===
                  currentFieldValues.lineItemTargetEndDate &&
                previousFieldValuesRef.current.lineItemTargetStartDate ===
                  currentFieldValues.lineItemTargetStartDate;

              if (onlyTLGChanged && debouncedFetchPacingDataRef.current) {
                // Use debounced version for Target Lead Goal changes
                debouncedFetchPacingDataRef.current({
                  targetLeadGoal: currentFieldValues.targetLeadGoal,
                  dateRange: dateRange,
                  pacingSchedule: pacingSchedule,
                });
              } else {
                // Cancel any pending debounced calls when dates change
                if (debouncedFetchPacingDataRef.current) {
                  debouncedFetchPacingDataRef.current.cancel();
                }
                // Call immediately for date changes
                fetchPacingData(true, {
                  targetLeadGoal: currentFieldValues.targetLeadGoal,
                  dateRange: dateRange,
                  pacingSchedule: pacingSchedule,
                });
              }
            }
          } else {
            // Still update the ref to track that we've seen these values
            // But don't fetch data due to validation errors
            previousFieldValuesRef.current = {
              ...currentFieldValues,
              pacingSchedule,
              customPacingData:
                previousFieldValuesRef.current.customPacingData || [],
            };
          }
        }
      }
    }
  }, [
    lineItemId,
    pacingSchedule,
    customPacingData,
    propTargetLeadGoal,
    propTargetDeliveryStartDate,
    propTargetEndDate,
    propLineItemTargetStartDate,
    fetchPacingData,
  ]);

  useEffect(() => {
    // Update pacing schedule when prop changes
    // When propPacingSchedule is null or empty, clear the state
    setPacingSchedule(propPacingSchedule || '');

    // Also clear edited data when pacing schedule is cleared (No Pacing selected)
    if (!propPacingSchedule) {
      setEditedData([]);
      // Don't fetch data when clearing pacing schedule
      return;
    }
  }, [propPacingSchedule]);
  // Initialize/update date range from props when drawer opens
  useEffect(() => {
    // Update date range when drawer opens with new prop values
    if (open && propTargetDeliveryStartDate && propTargetEndDate) {
      const newStartDate = dayjs(propTargetDeliveryStartDate);
      const newEndDate = dayjs(propTargetEndDate);
      setDateRange([newStartDate, newEndDate]);

      // In create mode, don't initialize on every open - let fetchPacingData handle it
      // This prevents overwriting the tracked values
    }
  }, [
    open,
    propTargetDeliveryStartDate,
    propTargetEndDate,
    lineItemId,
    watchedTargetLeadGoal,
    watchedTargetDeliveryStartDate,
    watchedLineItemTargetEndDate,
    watchedLineItemTargetStartDate,
    propTargetLeadGoal,
    propLineItemTargetStartDate,
    customPacingData,
  ]); // Update when drawer opens or props change
  useEffect(() => {
    // Don't auto-fetch when drawer opens - wait for user to select pacing schedule
    // Only use existing customPacingData if available
    if (open) {
      // In preview mode, immediately set customPacingData if available
      if (isPreviewMode && customPacingData && customPacingData.length > 0) {
        setEditedData(JSON.parse(JSON.stringify(customPacingData)));
        return; // Exit early to avoid running the rest of the logic
      }
      // Set a default pacing schedule if none is selected
      if (!pacingSchedule && !propPacingSchedule) {
        // Set Weekly as default if available
        // Let user select pacing schedule manually - no default
      }

      // Check if customPacingData has actually changed to prevent infinite loops
      const customPacingDataStr = JSON.stringify(customPacingData);
      if (customPacingDataStr !== lastCustomPacingDataRef.current) {
        lastCustomPacingDataRef.current = customPacingDataStr;

        // In preview mode, use existing customPacingData if available
        if (isPreviewMode) {
          // For preview mode, ALWAYS use customPacingData if it exists
          if (customPacingData && customPacingData.length > 0) {
            // Use the existing customPacingData for display
            setEditedData(JSON.parse(JSON.stringify(customPacingData)));
          } else {
            // If no customPacingData in preview mode, show empty (don't fetch from API)
            setEditedData([]);
          }
        } else {
          // In edit/create mode, handle data differently
          if (!lineItemId) {
            // In create mode, check if data was auto-updated due to field changes
            const formCustomPacingData =
              form?.getFieldValue('customPacingData');
            const wasAutoUpdated = form?.getFieldValue('pacingDataAutoUpdated');
            const currentTLG = targetLeadGoal || propTargetLeadGoal;

            // Check if TLG or dates changed and we have old data to show mismatch
            if (
              wasAutoUpdated &&
              previousFieldValuesRef.current.customPacingData &&
              previousFieldValuesRef.current.customPacingData.length > 0 &&
              previousFieldValuesRef.current.targetLeadGoal !== currentTLG
            ) {
              // TLG/dates changed, show OLD pacing data to display mismatch
              // Show old data in drawer for user to see mismatch
              setEditedData(
                JSON.parse(
                  JSON.stringify(
                    previousFieldValuesRef.current.customPacingData,
                  ),
                ),
              );

              // Clear the auto-updated flag
              form?.setFieldValue('pacingDataAutoUpdated', false);
            } else if (
              formCustomPacingData &&
              formCustomPacingData.length > 0
            ) {
              // Use form data (either user-adjusted or auto-fetched)
              setEditedData(JSON.parse(JSON.stringify(formCustomPacingData)));
            } else if (customPacingData && customPacingData.length > 0) {
              // Use prop data
              setEditedData(JSON.parse(JSON.stringify(customPacingData)));
            } else {
              // No data available, might need to fetch
              if (
                pacingSchedule &&
                targetLeadGoal > 0 &&
                dateRange &&
                !isFetchingRef.current
              ) {
                // Check if not already fetching to avoid duplicate calls
                fetchPacingData(false);
              } else if (!isFetchingRef.current) {
                setEditedData([]);
              }
            }
          } else {
            // Edit mode - use existing logic
            const formCustomPacingData =
              form?.getFieldValue('customPacingData');
            const dataToUse =
              formCustomPacingData && formCustomPacingData.length > 0
                ? formCustomPacingData
                : customPacingData;

            if (dataToUse && dataToUse.length > 0) {
              setEditedData(JSON.parse(JSON.stringify(dataToUse)));
            } else if (
              pacingSchedule &&
              targetLeadGoal > 0 &&
              dateRange &&
              !isFetchingRef.current
            ) {
              // Check if not already fetching to avoid duplicate calls
              fetchPacingData(true);
            } else if (!isFetchingRef.current) {
              setEditedData([]);
            }
          }
        }
      }
    }
  }, [
    open,
    customPacingData,
    pacingSchedule,
    propPacingSchedule,
    isPreviewMode,
    propTargetLeadGoal,
    targetLeadGoal,
    dateRange,
    fetchPacingData,
    form,
    lineItemId,
  ]);

  // Set original data when drawer opens for change detection
  useEffect(() => {
    if (open && originalData) {
      // Reset dates changed flag when drawer opens
      setDatesChanged(false);

      // Format dates consistently for comparison
      const formatDateValue = (date: any) => {
        if (!date) return null;
        if (typeof date === 'string') return date;
        return dayjs(date).format('YYYY-MM-DD');
      };

      setOriginalPacingData({
        pacing: originalData.pacing || pacing, // Include pacing field in original data
        pacingSchedule: originalData.pacingSchedule || propPacingSchedule,
        customPacingData: originalData.customPacingData || customPacingData,
        targetLeadGoal: originalData.targetLeadGoal || propTargetLeadGoal,
        targetDeliveryStartDate: formatDateValue(
          originalData.targetDeliveryStartDate || propTargetDeliveryStartDate,
        ),
        lineItemTargetEndDate: formatDateValue(
          originalData.lineItemTargetEndDate || propTargetEndDate,
        ),
        allowOverflow: originalData.allowOverflow ?? false,
        deficitManagement: originalData.deficitManagement ?? false,
      });

      // Set localOverflowDisabled based on original data
      if (originalData.allowOverflow) {
        setLocalOverflowDisabled(true);
      }
    }
  }, [
    open,
    originalData,
    propPacingSchedule,
    customPacingData,
    propTargetLeadGoal,
    propTargetDeliveryStartDate,
    propTargetEndDate,
  ]);

  // ============= RENDER =============
  // Calculate error flags for the footer
  // Check for mismatch when we have pacing data
  const isParentLeadRequiredError = !!(
    pacingSchedule &&
    pacingSchedule !== Pacing.UNCAPPED &&
    targetLeadGoal > 0 &&
    editedData.length > 0 &&
    currentTotal !== targetLeadGoal
  );
  const isChildLeadRequiredError = hasAnyWeekMismatch;

  return (
    <>
      <Drawer
        title={
          <Space>
            <Title level={4} style={{ margin: 0, color: '#ffffff' }}>
              Pacing Chart
            </Title>
          </Space>
        }
        placement='right'
        onClose={handleDrawerClose}
        open={open}
        width='50%'
        maskClosable={!(!lineItemId && isParentLeadRequiredError)} // Prevent mask click close in create mode with error
        keyboard={
          !(
            !lineItemId && // Block ESC in create mode when there's an error
            isParentLeadRequiredError
          )
        }
        footer={
          !isPreviewMode || !lineItemId ? ( // Show footer in create mode even if preview
            <PacingDrawerFooter
              currentTotal={currentTotal}
              targetLeadGoal={targetLeadGoal}
              lineItemId={lineItemId}
              onClose={handleDrawerClose}
              handleSave={handleSave}
              handleAutoAdjust={handleAutoAdjust}
              dateRange={dateRange}
              isParentLeadRequiredError={isParentLeadRequiredError}
              isChildLeadRequiredError={isChildLeadRequiredError}
              pacingSchedule={pacingSchedule}
            />
          ) : null
        }
        className={styles.pacingDrawer}>
        <Flex vertical>
          {localOverflowDisabled && pacing !== PacingType.NO_PACING && (
            <Alert
              description={
                <Text style={{ color: 'var(--dzone-color-error)' }}>
                  This line item has overflow enabled. All pacing caps are
                  disabled, and suppliers can publish leads without
                  restrictions. The line item is permanently in &apos;No
                  Pacing&apos; mode.
                </Text>
              }
              type='warning'
              showIcon
              icon={<WarningOutlined />}
              style={{
                marginBottom: '1rem',
                backgroundColor: '#fff7e6',
                border: '1px solid #faad14',
              }}
            />
          )}
          <PacingChartHeader
            dateRange={dateRange}
            pacingSchedule={pacingSchedule}
            setPacingSchedule={setPacingSchedule}
            pacingScheduleOptions={pacingScheduleOptions}
            allowOverflow={
              form?.getFieldValue('allowOverflow') ?? allowOverflow ?? false
            }
            setallowOverflow={(value: boolean) => {
              form?.setFieldValue('allowOverflow', value);
            }}
            deficitManagement={
              form?.getFieldValue('deficitManagement') ??
              deficitManagement ??
              true
            }
            setdeficitManagement={(value: boolean) => {
              form?.setFieldValue('deficitManagement', value);
            }}
            pacing={pacing}
            onPacingChange={onPacingChange}
            onDateClick={() => setShowDatePicker(true)}
            loading={loading}
            targetLeadGoal={targetLeadGoal}
            fetchPacingData={fetchPacingData}
            clearEditedData={() => {
              setEditedData([]);
              // Also clear the form field
              form?.setFieldValue('customPacingData', []);
            }}
            hasBeenLive={originalData?.hasBeenLive}
            originalPacingValue={
              originalData?.pacing?.value || originalData?.pacing?.name
            }
            isPreviewMode={isPreviewMode} // Pass through the actual preview mode state
            lineItemId={lineItemId}
            overflowDisabledPermanently={localOverflowDisabled}
            onOverflowEnable={handleLocalOverflowEnable}
          />

          <PacingTableSection
            loading={loading}
            pacingSchedule={pacingSchedule}
            targetLeadGoal={targetLeadGoal}
            editedData={editedData}
            hideZeroLeadCount={hideZeroLeadCount}
            setHideZeroLeadCount={setHideZeroLeadCount}
            handleLeadsCountChange={handleLeadsCountChange}
            onAutoAdjust={handleAutoAdjust}
            onPeriodAutoAdjust={handlePeriodAutoAdjust}
            isReadOnly={
              (isPreviewMode && !!lineItemId) || localOverflowDisabled
            }
            overflowDisabledPermanently={localOverflowDisabled}
          />
        </Flex>

        <PacingModals
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          dateRange={dateRange}
          handleDateRangeChange={handleDateRangeChange}
          showBlockingAlert={showBlockingAlert}
          setShowBlockingAlert={setShowBlockingAlert}
          allocationDifference={allocationDifference}
          targetLeadGoal={targetLeadGoal}
          currentTotal={currentTotal}
          handleAutoAdjust={handleAutoAdjust}
          targetStartDate={
            propLineItemTargetStartDate ||
            form?.getFieldValue(LineItemFields.LineItemTargetStartDate)
          }
          dateFieldRestrictions={
            originalData
              ? getDateFieldRestrictions(
                  originalData?.status,
                  originalData?.lineItemTargetEndDate,
                )
              : undefined
          }
          isEditMode={!!lineItemId} // Pass whether we're in edit mode (have a lineItemId)
        />
      </Drawer>
    </>
  );
};
