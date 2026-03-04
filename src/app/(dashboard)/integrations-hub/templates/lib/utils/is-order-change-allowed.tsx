import { ITemplateField } from '../types';

export const isOrderChangeAllowed = (
  currentIndex: number,
  newOrder: number,
  record: ITemplateField,
  disabledArrowIndexes: { up: number; down: number },
) => {
  if (currentIndex === -1) {
    return false;
  }

  if (newOrder <= 0) {
    return false;
  }

  if (record.visible) {
    if (disabledArrowIndexes.down >= 0 && newOrder > disabledArrowIndexes.down + 1) {
      return false;
    }
  } else {
    if (disabledArrowIndexes.up >= 0 && newOrder < disabledArrowIndexes.up + 1) {
      return false;
    }
  }

  return true;
};
