import { StorageKey } from '@/lib/enums';
import { Store } from './local-storage-store';

const DataKey = 'steps';

export const createCookieForExistingRecord = (
  storageKey: StorageKey,
  initialprops: Record<string, any>,
) => {
  const storedData = { ...initialprops };
  Store.set(storageKey, JSON.stringify(storedData));
};

export const saveFormDataInCookie = (
  formType: StorageKey,
  stepData: Record<string, any>,
  stepId: string | number,
) => {
  const storedData = getFormDataFromCookie(formType) || {};
  if (!storedData[DataKey]) {
    storedData[DataKey] = {};
  }
  storedData[DataKey][stepId] = stepData;
  Store.set(formType, JSON.stringify(storedData));
};

export const deleteFormDataFromCookie = (formType: StorageKey) => {
  Store.remove(formType);
};

export const getFormDataFromCookie = (formType: StorageKey) => {
  const storedData = Store.get(formType);
  if (storedData) {
    const updatedData = JSON.parse(storedData);
    return updatedData;
  }
  return {};
};

export const getSavedSteps = (formType: StorageKey) => {
  const storedData = getFormDataFromCookie(formType);
  return storedData?.[DataKey] || {};
};
