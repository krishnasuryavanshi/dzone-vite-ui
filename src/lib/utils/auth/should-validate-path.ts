// Do not change default export
// if required, move the file next ti middleware.ts

const shouldValidatePath = (path: string) => {
  let parent = '';
  const shouldValidate = Object.keys(config).some((key) => {
    if (path.startsWith(key)) {
      parent = key;
      return true;
    }
    return false;
  });
  return { shouldValidate, parent };
};

export default shouldValidatePath;

const campaignsRegex = /^\/campaign-management\/campaigns$/;
const campaignDetailRegex = /^\/campaign-management\/campaigns\/[^\/]+$/;
const createCampaignRegex = /^\/campaign-management\/campaigns\/create$/;
const campaignEditRegex = /^\/campaign-management\/campaigns\/[^\/]+\/edit$/;

const lineItemsRegex = /^\/campaign-management\/line-items$/;
const lineItemDetailRegex = /^\/campaign-management\/line-items\/[^\/]+$/;

const integrationDetailRegex = /^\/integrations-hub\/integrations\/[^\/]+$/;
const createLineItemRegex =
  /^\/campaign-management\/line-items(\/[^\/]+)?\/create$/; // /^\/campaign-management\/line-items\/create$/;
const updateLineItemRegex = /^\/campaign-management\/line-items\/[^\/]+\/edit$/;

const batchLeadsRegex =
  /^\/campaign-management\/line-items\/[^\/]+\/batches\/[^\/]+\/leads$/;
const lineItemLeadsRegex = /^\/campaign-management\/line-items\/[^\/]+\/leads$/;
const lineItemDeliveryLogsRegex =
  /^\/campaign-management\/line-items\/[^\/]+\/delivery-logs$/;

const lineItemsLeadValidationSettingsUpdate =
  /^\/lead-validation-settings\/line-items\/[^\/]+\/settings\/[^\/]+$/;
const tenantsLeadValidationSettingsUpdate =
  /^\/lead-validation-settings\/organizations\/[^\/]+\/settings\/[^\/]+$/;

const deliveryTemplateUpdate =
  /^\/integrations-hub\/templates\/[^\/]+\/update$/;

const rolesRegexp = /^\/ums\/roles\/[^\/]+$/;
const usersRegexp = /^\/ums\/users\/[^\/]+$/;
const organizationsRegexp = /^\/organizations\/[^\/]+$/;

type PageType = {
  url?: string;
  action: string;
  urlRegexp?: RegExp;
};

export const config: Record<string, PageType[]> = {
  '/organizations-dashboard': [
    { url: '/organizations-dashboard', action: 'Organizations.VIEW' },
  ],
  '/dashboard': [{ url: '/dashboard', action: 'Dashboard.VIEW' }],
  '/dzent': [{ url: '/dzent', action: 'Dzent.VIEW' }],
  '/dz-one-ai-coworker': [
    { url: '/dz-one-ai-coworker', action: 'Dzent.VIEW AI COWORKER' },
  ],
  '/campaign-management': [
    { url: '/campaign-management/campaigns', action: 'Campaign.VIEW' },
    {
      url: '/campaign-management/campaigns/create',
      action: 'Campaign.CREATE',
    },
    {
      urlRegexp: campaignsRegex,
      action: 'Campaign.VIEW',
    },
    {
      urlRegexp: campaignDetailRegex,
      action: 'Campaign.VIEW',
    },
    {
      urlRegexp: createCampaignRegex,
      action: 'Campaign.CREATE',
    },
    {
      urlRegexp: campaignEditRegex,
      action: 'Campaign.EDIT',
    },
    //Line Items
    { url: '/campaign-management/line-items', action: 'Line Item.VIEW' },
    {
      urlRegexp: createLineItemRegex,
      action: 'Line Item.CREATE',
    },
    {
      urlRegexp: lineItemsRegex,
      action: 'Line Item.VIEW',
    },
    {
      urlRegexp: lineItemDetailRegex,
      action: 'Line Item.VIEW',
    },
    {
      urlRegexp: updateLineItemRegex,
      action: 'Line Item.EDIT',
    },

    // Leads
    { url: '/campaign-management/leads', action: 'Leads.VIEW' },
    {
      urlRegexp: lineItemLeadsRegex,
      action: 'Leads.VIEW',
    },
    {
      urlRegexp: batchLeadsRegex,
      action: 'Leads.VIEW',
    },

    // Delivery Logs
    {
      urlRegexp: lineItemDeliveryLogsRegex,
      action: 'Line Item.VIEW',
    },
  ],
  '/lead-validation-settings': [
    { url: '/lead-validation-settings', action: 'Validation Settings.VIEW' },
    {
      url: '/lead-validation-settings/create',
      action: 'Validation Settings.CREATE',
    },
    {
      urlRegexp: tenantsLeadValidationSettingsUpdate,
      action: 'Validation Settings.EDIT',
    },
    {
      urlRegexp: lineItemsLeadValidationSettingsUpdate,
      action: 'Validation Settings.EDIT', // TODO: Update this action i.e user has permission of updating line items lead validation settings
    },
  ],
  '/integrations-hub': [
    // Integrations Hub - Delivery Templates

    { url: '/integrations-hub/templates', action: 'Delivery Templates.VIEW' },
    {
      url: '/integrations-hub/templates/create',
      action: 'Delivery Templates.CREATE',
    },
    {
      urlRegexp: deliveryTemplateUpdate,
      action: 'Delivery Templates.EDIT',
    },

    // Integrations Hub - Integrations
    { url: '/integrations-hub/integrations', action: 'Integrations.VIEW' },
    {
      urlRegexp: integrationDetailRegex,
      action: 'Integrations.VIEW',
    },
  ],
  '/ums': [
    { url: '/ums/roles', action: 'Roles and Permissions.VIEW' },
    {
      urlRegexp: rolesRegexp,
      action: 'Roles and Permissions.VIEW',
    },
    { url: '/ums/roles/create', action: 'Roles and Permissions.CREATE' },
    { url: '/ums/users', action: 'Users.VIEW' },
    { url: '/ums/users/create', action: 'Users.CREATE' },
    {
      urlRegexp: usersRegexp,
      action: 'Users.VIEW',
    },
  ],
  '/organizations': [
    { url: '/organizations', action: 'Organizations.VIEW' },
    { url: '/organizations/create', action: 'Organizations.VIEW' },
    {
      urlRegexp: organizationsRegexp,
      action: 'Organizations.VIEW',
    },
  ],
  '/jobs': [{ url: '/jobs', action: 'Jobs.VIEW' }],
  '/analytics': [
    { url: '/analytics/marketers', action: 'Marketer Report.VIEW' },
    { url: '/analytics/supplier', action: 'Supplier Report.VIEW' },
    { url: '/analytics', action: 'Analytics.VIEW' },
  ],
};
