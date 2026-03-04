import { cloneDeep, isArray, isEqual, isNull, isUndefined, omitBy } from 'lodash';

export const hasUnsavedChanges = (source: Record<string, any>, target: Record<string, any>) => {
  const srcObj = omitBy(
    cloneDeep(source),
    (v) => isUndefined(v) || isNull(v) || v === '' || (isArray(v) && v.length === 0),
  );
  const tgtObj = omitBy(
    cloneDeep(target),
    (v) => isUndefined(v) || isNull(v) || v === '' || (isArray(v) && v.length === 0),
  );

  return !isEqual(srcObj, tgtObj);
};
