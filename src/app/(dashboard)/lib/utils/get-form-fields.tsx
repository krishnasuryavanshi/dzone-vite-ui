import { cloneDeep } from 'lodash';

export const getFormFields = (config: any) => {
  const { meta, translation, fields } = config;

  const formFields = cloneDeep({
    meta: { ...meta, layout: meta.formLayout },
    translation,
    fields,
  });
  return { ...formFields };
};
