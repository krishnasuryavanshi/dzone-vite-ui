import { appLogger } from './logger';

export const logError = (data: unknown) => {
  appLogger.logError(data);
};
