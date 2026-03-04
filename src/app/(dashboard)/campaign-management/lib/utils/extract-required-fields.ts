import { IFieldConfig } from '@/lib/types';
import { CampaignStep } from '../../campaigns/lib/enums';

// Define a common interface for form sections
interface IStepSectionConfig<F, D> {
  fields?: IFieldConfig<F, D>[]; // Assuming each field can be of this type
}

// Common interface for form configurations
interface IFormConfig<S extends string | number | symbol, F, D> {
  steps: Record<S, IStepSectionConfig<F, D>[]>;
}

export const extractRequiredFields = <T extends string, F extends string, D>(
  formConfig: IFormConfig<T, F, D>, // Accept any form configuration
  upToStep: number, // Up to step is based on the step type
): string[] => {
  const allFields: string[] = [];
  for (const step of Object.keys(formConfig.steps) as T[]) {
    const currentStep = step;
    if (Number(currentStep) > upToStep) {
      break;
    }

    const fields = formConfig.steps[currentStep];
    if (Array.isArray(fields)) {
      fields.forEach((field) => {
        if (field.fields) {
          field.fields.forEach((innerField: IFieldConfig<F, D>) => {
            if (
              innerField.rules &&
              innerField.rules.some((rule) => (rule as { required: boolean }).required)
            ) {
              allFields.push(innerField.field);
            }
          });
        }
      });
    }
  }
  return allFields;
};
