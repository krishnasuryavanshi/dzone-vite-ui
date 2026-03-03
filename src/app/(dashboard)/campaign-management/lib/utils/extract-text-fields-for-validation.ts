import { FieldType } from '@/lib/enums';
import { CampaignStepSectionsType } from '../../campaigns/lib/types';

export const extractFieldNamesForValidation = (
  sections: CampaignStepSectionsType
) => {
  const requiredFieldNames: string[] = [];
  sections.forEach((section) => {
    section.fields.forEach((field) => {
      if (
        field.fieldType === FieldType.Text ||
        field.fieldType === FieldType.TextArea
      ) {
        const fieldName = field.field;
        if (typeof fieldName === 'string') {
          requiredFieldNames.push(fieldName);
        }
      }
    });
  });
  return requiredFieldNames;
};
