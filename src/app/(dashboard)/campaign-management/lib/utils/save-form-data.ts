import { StepsProgress, StorageKey } from '@/lib/enums';
import {
  createCookieForExistingRecord,
  saveFormDataInCookie,
} from '@/services';
import { cloneDeep, pick } from 'lodash';
import { CreateCampaignConfig } from '../../campaigns/config/form';
import { LineItemFormConfig } from '../../line-items/config/forms';
import { ILineItem } from '../../line-items/lib/types';
import { ICampaign } from '../../campaigns/lib/types';
import { formatCampaignFormData } from './format-campaign-form-data';
import { formatLineItemFormData } from './format-line-item-form-data';

export const saveFormDataInCookies = async (
  data: Record<string, any>,
  storage: StorageKey,
  isDzoneUser?: boolean,
) => {
  saveInitialData(data, storage);
  const formData =
    storage === StorageKey.CampaignForm
      ? formatCampaignFormData(data as ICampaign)
      : formatLineItemFormData(data as ILineItem);
  saveStepwiseData(formData, storage, isDzoneUser);
  return true;
};

const saveInitialData = (data: Record<string, any>, storage: StorageKey) => {
  const initialData = {
    finishedStepId: data?.stepId - 1,
    id: data?.id,
  };
  createCookieForExistingRecord(storage, initialData);
};

const saveStepwiseData = (
  data: Record<string, any>,
  storage: StorageKey,
  isDzoneUser?: boolean,
) => {
  const { steps } =
    storage === StorageKey.CampaignForm
      ? cloneDeep(CreateCampaignConfig(isDzoneUser))
      : cloneDeep(LineItemFormConfig);
  const stepsKeys = Object.keys(steps);
  for (const step of stepsKeys) {
    if (Number(step) < data.stepId) {
      const stepKeys = getFieldKeys((steps as any)[step] as any[]);
      const stepData = {
        status: StepsProgress.Processed,
        fields: pick(data, stepKeys),
      };
      saveFormDataInCookie(storage, stepData, step);
    } else {
      break;
    }
  }
};

const getFieldKeys = (sections: any[]) => {
  return sections.flatMap((section) =>
    section.fields.map((field: Record<string, any>) => field.field),
  );
};
