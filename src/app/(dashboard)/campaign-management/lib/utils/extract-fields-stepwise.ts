import { StorageKey } from "@/lib/enums";
import { getFormDataFromCookie } from "@/services/cookie-stepper-form";

export const extractFieldsStepwise = (storage: StorageKey) => {
    const stepData = getFormDataFromCookie(storage);
   const stepFields = Object.values(stepData.steps).map((val: any) =>{
    return val.fields;
   })
    return stepFields;
};

