import { cloneDeep, omitBy } from 'lodash';

export const getDeltaOfObjects = (source: any, target: any) => {
  const delta = omitBy(cloneDeep(target), (v, key) => source[key] === v);
  return delta;
};
