import { useForm, useWatch } from '@/uicomponents/form';
import { useEffect, useRef, useState } from 'react';
import {
  createCampaign,
  prefilledLists,
  putCreateCampaign,
} from '../../services';
import { calculateDateDiffs, formatDate, sanitizeData } from '@/lib/utils';
import {
  formatCampaignFormData,
  getChangedFields,
  processFieldPermissions,
} from '../../../lib/utils';
import CampaignDetailsSchema from '../schemas/campaign-form.json';
import { showNotification } from '@/services/notification';
import debounce from 'lodash/debounce';
import { useRouter } from '@/lib/hooks/use-router';
import { fetchFileDetails } from '../../../line-items/services';
import { UploadFile } from '@/lib/types/uicomponents';
import { uploadIOFile } from '@/services/file-upload';
import dayjs from 'dayjs';
import { CampaignField } from '../enums';

export const useCampaignForm = ({
  campaignData,
  campaignUUId,
  tenantCode,
  userId,
  isDzoneUser,
}: any) => {
  const previousMarketerCode = useRef<string | undefined>(undefined);
  const router = useRouter();
  const [form] = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lists, setLists] = useState<Record<string, any[]>>({});
  const [disabledFields, setDisabledFields] = useState<Record<string, boolean>>(
    {},
  );
  const [hasChanges, setHasChanges] = useState(false);

  const allFields = useWatch([], form);
  const marketerCode = allFields?.marketerCode;

  const handleSubmit = debounce(async (values: any) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        targetStartDate: values?.targetStartDate
          ? formatDate(values?.targetStartDate)
          : undefined,
        targetEndDate: values?.targetEndDate
          ? formatDate(values?.targetEndDate)
          : undefined,
        opportunityCloseDate: values?.opportunityCloseDate
          ? formatDate(values?.opportunityCloseDate)
          : undefined,
        ioFileId: values?.ioFileId?.id,
        bookedRevenue:
          values?.bookedRevenue === 0 ? undefined : values?.bookedRevenue,
      };
      if (campaignUUId) {
        const initialFormatted = formatCampaignFormData(campaignData);
        const changedFields = getChangedFields(
          initialFormatted,
          sanitizeData(payload),
        );
        if (Object.keys(changedFields).length > 0) {
          const data = await putCreateCampaign(
            sanitizeData(changedFields),
            campaignUUId,
          );
          if (data?.data) {
            showNotification({ message: data.message });
            router.push('/campaign-management/campaigns');
          } else {
            showNotification({ message: data.message, type: 'error' });
          }
        }
      } else {
        const data = await createCampaign(sanitizeData(payload));
        if (data?.data) {
          showNotification({ message: data.message });
          router.push('/campaign-management/campaigns');
        } else {
          showNotification({ message: data.message, type: 'error' });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }, 500);

  const fetchLists = async () => {
    const fetchedLists = await prefilledLists(userId);
    setDisabledFields({
      campaignDuration: true,
    });
    if (tenantCode && !isDzoneUser) {
      const marketer = fetchedLists.marketers?.find(
        (m) => m.tenantCode === tenantCode[0],
      );
      if (marketer) {
        form.setFieldsValue({
          marketerCode: marketer.tenantCode,
          marketer: marketer.label,
          tenantCode: marketer.tenantCode,
        });
        previousMarketerCode.current = marketer.tenantCode;
      }
      setDisabledFields({
        marketerCode: true,
        marketer: true,
        tenantCode: true,
        ioFileId: false,
      });
    }

    setLists(fetchedLists);
  };

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    if (!marketerCode || !lists?.marketers?.length) return;
    if (previousMarketerCode.current !== marketerCode) {
      const selectedMarketer = lists.marketers.find(
        (m) => m.tenantCode === marketerCode,
      );
      if (selectedMarketer) {
        form.setFieldsValue({
          marketer: selectedMarketer.label,
          marketerCode: selectedMarketer.tenantCode,
          tenantCode: selectedMarketer.tenantCode,
        });
        previousMarketerCode.current = marketerCode;
      }
    }
  }, [marketerCode, lists?.marketers]);

  useEffect(() => {
    const duration = calculateDateDiffs(
      allFields?.targetStartDate,
      allFields?.targetEndDate,
    );
    form.setFieldsValue({
      campaignDuration: duration,
    });

    // Cross-field validation for target dates
    const targetStartDate = allFields?.targetStartDate;
    const targetEndDate = allFields?.targetEndDate;

    if (targetStartDate && targetEndDate) {
      if (dayjs(targetEndDate).isBefore(dayjs(targetStartDate), 'day')) {
        form.setFields([
          {
            name: CampaignField.TargetEndDate,
            errors: [
              'Target End Date must be greater than or equal to Target Start Date',
            ],
          },
        ]);
      } else {
        // Clear validation errors when dates are valid
        form.setFields([
          { name: CampaignField.TargetStartDate, errors: [] },
          { name: CampaignField.TargetEndDate, errors: [] },
        ]);
      }
    }
  }, [allFields?.targetStartDate, allFields?.targetEndDate]);

  useEffect(() => {
    if (!campaignData || !lists) return;
    const formatted = formatCampaignFormData(campaignData);
    form.setFieldsValue({
      ...formatted,
      marketerCode: formatted?.tenantCode,
    });
    setDisabledFields({
      marketerCode: true,
      marketer: true,
      campaignId: true,
      campaignDuration: true,
    });
  }, [lists, campaignData]);

  useEffect(() => {
    const hasChanged = getChangedFields(
      formatCampaignFormData(campaignData),
      allFields,
    );
    setHasChanges(Object.keys(hasChanged).length > 0);
  }, [allFields, campaignData]);

  const processFieldRules = (field: any) => {
    const rules: any[] = [];

    if (field.rules?.length) {
      field.rules.forEach((rule: any) => {
        if (rule.pattern) {
          rules.push({
            pattern: new RegExp(rule.pattern),
            message: rule.message || 'Invalid format',
          });
        } else {
          rules.push(rule);
        }
      });
    }

    if (field.fieldType === 'number' && typeof field.min === 'number') {
      rules.push({
        type: 'number',
        min: field.min,
        message: `Must be at least ${field.min}`,
      });
    }

    // Add date validation for campaign date fields
    if (field.fieldType === 'date') {
      const dateFields = [
        CampaignField.TargetStartDate,
        CampaignField.TargetEndDate,
        CampaignField.OpportunityCloseDate,
      ];
      if (dateFields.includes(field.field)) {
        rules.push({
          validator: (_: any, value: any) => {
            if (value && dayjs(value).isBefore(dayjs().startOf('day'))) {
              return Promise.reject(
                new Error(`${field.label} cannot be in the past`),
              );
            }
            return Promise.resolve();
          },
        });

        // Add target end date validation - must be >= target start date
        if (field.field === CampaignField.TargetEndDate) {
          rules.push({
            validator: (_: any, value: any) => {
              const targetStartDate = form.getFieldValue(
                CampaignField.TargetStartDate,
              );
              if (value && targetStartDate) {
                if (dayjs(value).isBefore(dayjs(targetStartDate), 'day')) {
                  return Promise.reject(
                    new Error(
                      'Target End Date must be greater than or equal to Target Start Date',
                    ),
                  );
                }
              }
              return Promise.resolve();
            },
          });
        }

        // Add target start date validation - when changed, validate target end date
        if (field.field === CampaignField.TargetStartDate) {
          rules.push({
            validator: (_: any, value: any) => {
              const targetEndDate = form.getFieldValue(
                CampaignField.TargetEndDate,
              );
              if (value && targetEndDate) {
                if (dayjs(targetEndDate).isBefore(dayjs(value), 'day')) {
                  // Clear the target end date error and set it on the target end date field
                  setTimeout(() => {
                    form.setFields([
                      {
                        name: CampaignField.TargetEndDate,
                        errors: [
                          'Target End Date must be greater than or equal to Target Start Date',
                        ],
                      },
                    ]);
                  }, 0);
                }
              }
              return Promise.resolve();
            },
          });
        }
      }
    }

    return rules;
  };

  const fetchInitialFileLists = async () => {
    if (!campaignData) return;

    const ioFileId = campaignData.ioFileId;

    if (typeof ioFileId === 'string') {
      const detail = await fetchFileDetails(ioFileId);
      if (detail?.id) {
        const enrichedDeliveryTemplate: UploadFile = {
          id: detail.id,
          uid: detail.id,
          name: detail.filename,
          status: 'done',
          ...detail,
        };

        form.setFieldValue('ioFileId', enrichedDeliveryTemplate);
      }
    }
  };

  useEffect(() => {
    fetchInitialFileLists();
  }, [campaignData, form]);

  const processedFields = processFieldPermissions(
    CampaignDetailsSchema || [],
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

  return {
    form,
    handleSubmit,
    isSubmitting,
    hasChanges,
    groupedFields,
    lists,
    marketerCode,
    processFieldRules,
  };
};
