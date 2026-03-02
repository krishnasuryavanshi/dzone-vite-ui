import { ITemplateField } from '../types';

export const getLastVisibleFieldIndex = (fields: ITemplateField[]) => {
  return fields.reduce((acc, currentObject, index) => {
    if (currentObject.visible) {
      return index;
    }
    return acc;
  }, -1);
};
