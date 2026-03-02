import { StorageKey } from '@/lib/enums';
import { getSavedSteps } from '@/services/cookie-stepper-form';
import { useEffect, useState } from 'react';

export const useSavedSteps = (storageKey: StorageKey, step: any) => {
  const [savedSteps, setSavedSteps] = useState<{ step: number; status: 'processed' }[]>([]);

  useEffect(() => {
    const savedSteps = getSavedSteps(storageKey);
    const savedStepsData = Object.keys(savedSteps).map((key) => ({
      step: +key,
      status: savedSteps[key].status,
    }));
    setSavedSteps(savedStepsData);
  }, [step]);

  return savedSteps;
};
