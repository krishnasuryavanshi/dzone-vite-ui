import { ApiHost } from '../constants';

export const getApiKey = (service: string | undefined) => {
  let apiKey: string = '';

  if (service === ApiHost.ReportingService) {
    apiKey = `${process.env.REPORTING_SECRET_TOKEN}`;
  }

  return apiKey;
};
