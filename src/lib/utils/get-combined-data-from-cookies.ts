import { getSavedSteps } from '@/services/cookie-stepper-form';
import { StorageKey } from '../enums';
import { showNotification } from '@/services/notification';

export const getCombinedDataFromCookies = (
  values: any,
  currentStep: number,
  storageKey: StorageKey.CampaignForm | StorageKey.LineItemForm
) => {
  const formDataFromCookie = getSavedSteps(storageKey);

  if (!formDataFromCookie) {
    if (currentStep) {
      showNotification({
        message: 'Fill all required fields',
        type: 'error',
      });
      throw 'Fill all required fields';
    }
    return { ...values, stepId: currentStep + 1 };
  }

  const updatedData = Object.keys(formDataFromCookie)
    .filter((stepId: string) => +stepId <= currentStep)
    .map((step: string) => {
      const fields = formDataFromCookie[step]?.fields;
      return fields;
    });

  const combinedData = Object.assign({}, ...updatedData);
  return { ...combinedData, ...values, stepId: currentStep + 1 };
};
