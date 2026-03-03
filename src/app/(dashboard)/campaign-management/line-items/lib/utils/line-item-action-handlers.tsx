import { logError } from '@/services/logger';
import { StepsProgress, StorageKey } from '@/lib/enums';
import { normalizeDates, sanitizeData } from '@/lib/utils';
import { getCombinedDataFromCookies } from '@/lib/utils/get-combined-data-from-cookies';
import {
  deleteFormDataFromCookie,
  saveFormDataInCookie,
} from '@/services/cookie-stepper-form';
import { showNotification } from '@/services/notification';
import { FormInstance } from '@/uicomponents/form';
import { formatLineItemFormData, getChangedData } from '../../../lib/utils';
import { createLineItem } from '../../services/create-line-item';
import { updateLineItem } from '../../services/update-line-item';
import { lineItemDateFields } from '../constants';
import { RemoveNotRequiredKeys } from '../enums';
import { UploadFiles } from '../enums/upload_fils.enum';
import { ILineItem } from '../types';
import { transformIndustriesRequest } from './transform-industry-request';
import { transformJobTitles } from './transform-job-titles';
import { validateCombinedData } from './validate-combined-data';

const transformIndustries = (data: any) => {
  // TODO: fix any type
  // convert industries ans subindustries
  if (data?.industries) {
    data.industries = transformIndustriesRequest(data?.industries);
  }
};

const setDefaultCustomRangeValues = (
  values: any,
  isCustom: boolean,
  minField: string,
  maxField: string,
) => {
  if (isCustom) {
    values[minField] =
      values[minField] === undefined || values[minField] === null
        ? -2
        : values[minField];
    values[maxField] =
      values[maxField] === undefined || values[maxField] === null
        ? -1
        : values[maxField];
  } else {
    values[minField] = -2;
    values[maxField] = -1;
  }
};

export const handleSave = async (
  router: any,
  form: FormInstance<any>,
  step: number,
  existingLineItemDetails: Record<string, any> | undefined,
  requiredFields: string[],
  campaignId?: string,
  lineItemDetails?: ILineItem,
) => {
  try {
    const values = await form.validateFields();
    values.campaignId = campaignId;
    const dateFormFields = normalizeDates(lineItemDateFields, values);
    const combinedData = getCombinedDataFromCookies(
      { ...values, ...dateFormFields },
      step,
      StorageKey.LineItemForm,
    );
    setDefaultCustomRangeValues(
      combinedData,
      combinedData.isCompanySizeRevenueCustom,
      'companySizeRevenueCustomRangeMin',
      'companySizeRevenueCustomRangeMax',
    );

    setDefaultCustomRangeValues(
      combinedData,
      combinedData.isCompanySizeEmployeeCountCustom,
      'companySizeEmployeeCountCustomRangeMin',
      'companySizeEmployeeCountCustomRangeMax',
    );
    for (const [key, idField] of Object.entries(UploadFiles)) {
      if (combinedData[key]) {
        combinedData[idField] = combinedData[key].id || undefined;
      }
    }

    const keysToRemove = Object.values(RemoveNotRequiredKeys);

    let cleanedData = Object.fromEntries(
      Object.entries(combinedData).filter(
        ([key]) =>
          !keysToRemove.includes(key as unknown as RemoveNotRequiredKeys),
      ),
    );
    let changedData = { ...combinedData };
    if (!validateCombinedData(changedData, requiredFields)) {
      return;
    }
    if (existingLineItemDetails?.id) {
      // Retrieve previous data for the current step
      const previousStepId = existingLineItemDetails?.finishedStepId;
      const previousData = formatLineItemFormData(lineItemDetails!);
      // Extract changed data if we are editing
      changedData = getChangedData(combinedData, previousData);
      for (const [key, idField] of Object.entries(UploadFiles)) {
        if (changedData[key]) {
          changedData[idField] = changedData[key].id || undefined;
        }
      }
      // Include stepId only if the current step is greater than or equal to the previous step
      if (step > 0 && (previousStepId === undefined || step > previousStepId)) {
        changedData.stepId = step + 1;
      } else {
        changedData.stepId = null;
      }
    }
    // convert industries ans subindustries
    transformIndustries(
      existingLineItemDetails?.id ? changedData : cleanedData,
    );
    // convert job titles
    transformJobTitles(existingLineItemDetails?.id ? changedData : cleanedData);
    changedData = { ...changedData, assignedTo: undefined };
    cleanedData = { ...cleanedData, assignedTo: undefined };
    const id = existingLineItemDetails?.id;
    const data = id
      ? await updateLineItem(sanitizeData(changedData), id)
      : await createLineItem(sanitizeData(cleanedData));
    if (data.data) {
      showNotification({ message: data.message });
      handleCancel(router);
      return true;
    } else {
      showNotification({ message: data.message, type: 'error' });
    }
  } catch (error) {
    logError(error);
  }
};

export const handleClose = (router: any) => {
  router.push('/campaign-management/line-items');
};

export const handleCancel = (router: any) => {
  deleteFormDataFromCookie(StorageKey.LineItemForm);
  handleClose(router);
};

export const handleNext = async (
  router: any,
  form: FormInstance<any>,
  step: number,
  updateQueryParams: (step: number) => void,
  campaignId?: string,
) => {
  try {
    const values = await form.validateFields();
    values.campaignId = campaignId;
    setDefaultCustomRangeValues(
      values,
      values.isCompanySizeRevenueCustom,
      'companySizeRevenueCustomRangeMin',
      'companySizeRevenueCustomRangeMax',
    );

    setDefaultCustomRangeValues(
      values,
      values.isCompanySizeEmployeeCountCustom,
      'companySizeEmployeeCountCustomRangeMin',
      'companySizeEmployeeCountCustomRangeMax',
    );
    const dateFormFields = normalizeDates(lineItemDateFields, values);
    saveFormDataInCookie(
      StorageKey.LineItemForm,
      {
        status: StepsProgress.Processed,
        fields: { ...values, ...dateFormFields },
      },
      step,
    );
    handleClose(router);
    updateQueryParams(Number(step) + 1);
  } catch (error) {}
};
