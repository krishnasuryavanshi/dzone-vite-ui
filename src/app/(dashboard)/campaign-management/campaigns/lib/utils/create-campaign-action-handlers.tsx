'use client';
import { StepsProgress, StorageKey } from '@/lib/enums';
import { normalizeDates } from '@/lib/utils';
import { getCombinedDataFromCookies } from '@/lib/utils/get-combined-data-from-cookies';
import {
  deleteFormDataFromCookie,
  saveFormDataInCookie,
} from '@/services/cookie-stepper-form';
import { showNotification } from '@/services/notification';
import { FormInstance } from '@/uicomponents/form';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { formatCampaignFormData, getChangedData } from '../../../lib/utils';
import { createCampaign, putCreateCampaign } from '../../services';
import { CampaignField } from '../enums';
import { ICampaign } from '../types';
import { campaignDateFields } from '../constants/campaign-date-fields';
import { validateCombinedData } from './validate-combined-data';
import { cloneDeep } from 'lodash';
import { CreateCampaignConfig } from '../../config/form';

export const handleClose = (router: any) => {
  router.push('/campaign-management/campaigns');
};
export const onHandleCancel = (router: any) => {
  deleteFormDataFromCookie(StorageKey.CampaignForm);
  handleClose(router);
};
export const onHandleNext = async (
  router: any,
  form: { validateFields: () => any },
  step: number,
  updateQueryParams: (step: number) => void,
  isDzoneUser?: boolean,
) => {
  const { steps } = cloneDeep(CreateCampaignConfig(isDzoneUser));
  const stepnums = Object.keys(steps).map(Number);
  const currentStepIndex = stepnums.indexOf(step);
  const nextStepIndex = currentStepIndex + 1;
  const nextStep = stepnums[nextStepIndex];
  try {
    const values = await form.validateFields();
    const dateFormFields = normalizeDates(campaignDateFields, values);
    saveFormDataInCookie(
      StorageKey.CampaignForm,
      {
        status: StepsProgress.Processed,
        fields: { ...values, ...dateFormFields },
      },
      step,
    );
    handleClose(router);
    updateQueryParams(nextStep);
  } catch (errorInfo) {}
};

export const onHandleSave = async (
  form: FormInstance<any>,
  router: AppRouterInstance,
  existingCampaignDetails: Record<string, any> | undefined,
  step: number,
  requiredFormFields: string[],
  campaign?: ICampaign,
) => {
  try {
    // Validate form fields
    const values = await form.validateFields();

    const dateFormFields = normalizeDates(campaignDateFields, values);

    // Combine form values and normalize fields
    const combinedData = getCombinedDataFromCookies(
      { ...values, ...dateFormFields },
      step,
      StorageKey.CampaignForm,
    );

    combinedData[CampaignField.UploadIoFile] =
      combinedData[CampaignField.UploadIoFile]?.id;

    let changedData = combinedData;

    if (existingCampaignDetails?.id) {
      // Retrieve previous data for the current step
      const previousStepId = existingCampaignDetails?.finishedStepId;
      const previousData = formatCampaignFormData(campaign!);

      // Extract changed data if we are editing
      changedData = getChangedData(combinedData, previousData);

      // Include stepId only if the current step is greater than or equal to the previous step
      if (step > 0 && (previousStepId === undefined || step > previousStepId)) {
        changedData.stepId = step + 1;
      } else {
        changedData.stepId = null;
      }
    }

    // Validate combined data for required fields
    if (!validateCombinedData(combinedData, requiredFormFields)) {
      return;
    }
    Object.keys(combinedData).forEach((key) => {
      if (combinedData[key] === '') {
        combinedData[key] = undefined;
      }
    });
    const id = existingCampaignDetails?.id;
    const data = id
      ? await putCreateCampaign(changedData, id)
      : await createCampaign(combinedData);

    if (data.data) {
      showNotification({ message: data.message });
      onHandleCancel(router);
      return true;
    } else {
      showNotification({ message: data.message, type: 'error' });
    }
  } catch (errorInfo) {}
};
