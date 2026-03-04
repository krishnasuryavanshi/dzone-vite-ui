/**
 * Determines the redirect URL based on lineItemId and redirectTo query parameter
 *
 * @param lineItemId - Optional line item ID from store
 * @param redirectTo - Optional redirect type from query parameter ('view' | 'edit')
 * @returns The URL to redirect to
 */
export const getNavigationUrl = (lineItemId?: string | null, redirectTo?: string): string => {
  if (lineItemId) {
    if (redirectTo === 'view') {
      return `/campaign-management/line-items/${lineItemId}`;
    } else if (redirectTo === 'edit') {
      return `/campaign-management/line-items/${lineItemId}/edit`;
    } else {
      // Default: redirect to view page if redirectTo not present
      return `/campaign-management/line-items/${lineItemId}`;
    }
  } else {
    return '/lead-validation-settings';
  }
};
