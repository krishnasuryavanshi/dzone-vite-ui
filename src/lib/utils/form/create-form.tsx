import { FieldType, OptionsType } from '@/lib/enums';
import { showNotification } from '@/services/notification';
import { FormLayout } from '@/uicomponents/form';

const selectionInputs = [
  FieldType.SearchableSelect,
  FieldType.Select,
  FieldType.SearchableMultiSelect,
  FieldType.Multiselect,
];

export function createForm(rawForm: any) {
  try {
    const form: any = {};
    form.meta = getFormMeta(rawForm.meta);
    form.fields = getFormFields(rawForm.fields, rawForm.translation);
    return form;
  } catch (error: unknown) {
    showNotification({
      message: `System Error: ${error} ${rawForm.meta.name}` as string,
      type: 'error',
    });
    throw error;
  }
}

const getFormMeta = ({ name, className, ...rest }: any) => {
  if (!['vertical', 'horizontal'].includes(rest.formLayout)) {
    throw new Error('Invalid form layout');
  }
  return { name, className, layout: rest.formLayout as FormLayout };
};

const getFormFields = (fields: any, transKey: string) => {
  const fieldsObject: any = {};
  for (const key of Object.keys(fields)) {
    const rawField = fields[key];
    const invalidMessage = validateFieldConfig(rawField);
    if (invalidMessage) {
      throw `${invalidMessage} ${key}`;
    }
    const fieldObj = {
      item: getFormItem(key, rawField, transKey),
      inputOptions: getInputOptions(key, rawField, transKey),
    };

    fieldsObject[key] = fieldObj;
  }
  return fieldsObject;
};

const getFormItem = (key: string, rawField: any, transKey: string) => {
  const formItem: any = {
    name: key,
    label: `${transKey}.${key}.label`,
  };

  if (rawField?.fieldLayout) {
    formItem.fieldLayout = rawField.fieldLayout;
  }

  if (rawField?.rules?.length) {
    formItem.rules = getValidationRules(key, rawField.rules, transKey);
  }

  return formItem;
};

const getInputOptions = (key: string, rawField: any, transKey: string) => {
  const inputOptions: any = { optionsType: rawField.optionsType };
  if (rawField.disabled) {
    inputOptions.disabled = true;
  }
  if (
    selectionInputs.includes(rawField.fieldType) &&
    rawField.optionsType === OptionsType.Static
  ) {
    inputOptions.options = rawField.options;
  }
  return inputOptions;
};

const getValidationRules = (key: string, rules: any, transKey: string) => {
  const validationRules: any = [];
  for (const rule of rules) {
    if (rule.required) {
      validationRules.push({
        required: true,
        message: `${transKey}.${key}.requiredValidationError`,
      });
    }
    if (rule?.custom?.length) {
      //TODO
    }
  }
  return validationRules;
};

const validateFieldConfig = (rawFieldObj: any) => {
  if (!rawFieldObj.fieldType) {
    return 'Invalid field type';
  }

  if (selectionInputs.includes(rawFieldObj.fieldType)) {
    if (!rawFieldObj.optionsType) {
      return 'Invalid options type';
    } else if (
      rawFieldObj.optionsType === OptionsType.Static &&
      !rawFieldObj?.options?.length
    ) {
      return 'Invalid options';
    }
  }
};
