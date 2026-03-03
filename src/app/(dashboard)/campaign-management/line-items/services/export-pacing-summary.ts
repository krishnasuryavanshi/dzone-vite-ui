import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest, showNotification } from '@/services';
import { logError } from '@/services/logger';
import { transformPath } from '@/lib/utils/string/transform-path';

export const exportPacingSummary = async (lineItemId: string) => {
  try {
    const resource = transformPath(ApiResources.PacingPerformanceExport, {
      lineItemId,
    });
    const { data } = await authenticatedRequest({ resource, apiHost: ApiHost.PlatformService });
    if (data?.url) {
      const link = document.createElement('a');
      link.href = data.url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return { success: true };
    }
    showNotification({ type: 'error', message: 'Export failed' });
    return { success: false };
  } catch (error) {
    logError(error);
    showNotification({ type: 'error', message: 'Export failed' });
    return { success: false };
  }
};
