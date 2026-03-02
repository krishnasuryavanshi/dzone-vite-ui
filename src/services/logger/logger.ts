import { Level } from '@/lib/enums';

const ENV = import.meta.env.VITE_APP_ENV || process.env.NEXT_PUBLIC_APP_ENV;

export async function logger(
  level: Level,
  message: string,
  resource: string,
  action: string,
  payload?: Record<string, any>,
) {
  const logEvent = {
    message,
    level,
    resource,
    action,
    payload: JSON.stringify(payload),
  };

  // eslint-disable-next-line
  console.log(logEvent);
  return;
}

export const logHttpRequest = (data: Record<string, any>, isError = false) => {
  // eslint-disable-next-line
  console[isError ? 'error' : 'log'](data);
};
