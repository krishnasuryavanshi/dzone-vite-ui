import { dateObject } from '@/lib/utils/date-util';
import { StorageKey } from '@/lib/enums';
import { getSavedSteps } from '@/services/cookie-stepper-form';
import { dateFields } from '../../../lib/constants';

const getInitialFormValues = (
  step: number,
  storageKey: StorageKey.LineItemForm | StorageKey.CampaignForm,
) => {
  const formDataFromCookie = getSavedSteps(storageKey);
  return formDataFromCookie?.[step] || {};
};

export const setupInitialValues = (
  patchFormValues: (values: any) => void,
  step: number,
  storageKey: StorageKey.LineItemForm | StorageKey.CampaignForm,
) => {
  const { fields } = getInitialFormValues(step, storageKey);
  if (fields) {
    const formattedValues = { ...fields };

    for (const field of dateFields) {
      if (formattedValues[field]) {
        formattedValues[field] = dateObject(formattedValues[field]);
      }
    }
    patchFormValues(formattedValues);
  }
};
