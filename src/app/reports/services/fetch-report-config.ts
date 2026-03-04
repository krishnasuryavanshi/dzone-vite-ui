import { ReportPageConfig } from '../lib/types';
import { pacingReportConfig } from '../mocks/pacing-report-config';

const configMap: Record<string, ReportPageConfig> = {
  pacing: pacingReportConfig,
};

export async function fetchReportConfig(reportId: string): Promise<ReportPageConfig> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300));

  const config = configMap[reportId];
  if (!config) {
    throw new Error(`Report config not found: ${reportId}`);
  }
  return config;
}
