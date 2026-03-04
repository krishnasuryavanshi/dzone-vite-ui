import { Filters, Sorter } from '@/lib/utils/table';
import { ICampaign } from '@/app/(dashboard)/campaign-management/campaigns/lib/types';
import { ILineItem } from '@/app/(dashboard)/campaign-management/line-items/lib/types';
import { FetchPacingScheduleParams } from '@/app/(dashboard)/campaign-management/line-items/services/fetch-pacing-schedule';

export const queryKeys = {
  campaigns: {
    all: ['campaigns'] as const,
    lists: () => [...queryKeys.campaigns.all, 'list'] as const,
    list: (params: { page: number; size: number; filters?: Filters<ICampaign> }) =>
      [...queryKeys.campaigns.lists(), params] as const,
    details: () => [...queryKeys.campaigns.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.campaigns.details(), id] as const,
    detailView: (id: string, restrictedFields: (string | false)[]) =>
      [...queryKeys.campaigns.details(), 'detailView', id, restrictedFields] as const,
    statuses: () => [...queryKeys.campaigns.all, 'statuses'] as const,
    campaignsByMarketer: (tenantCode: string) =>
      [...queryKeys.campaigns.all, 'byMarketer', tenantCode] as const,
  },
  lineItems: {
    all: ['lineItems'] as const,
    lists: () => [...queryKeys.lineItems.all, 'list'] as const,
    list: (params: { page: number; size: number; campaignId?: string; filters?: Filters<ILineItem> }) =>
      [...queryKeys.lineItems.lists(), params] as const,
    details: () => [...queryKeys.lineItems.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.lineItems.details(), id] as const,
    additionalDetails: (id?: string) => [...queryKeys.lineItems.details(), 'additionalDetails', id] as const,
    statuses: () => [...queryKeys.lineItems.all, 'statuses'] as const,
    history: (id: string) =>
      [...queryKeys.lineItems.all, 'history', id] as const,
  },
  leads: {
    all: ['leads'] as const,
    lists: () => [...queryKeys.leads.all, 'list'] as const,
    list: (params: Record<string, any>) =>
      [...queryKeys.leads.lists(), params] as const,
    details: () => [...queryKeys.leads.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.leads.details(), id] as const,
    filterOptions: () => [...queryKeys.leads.all, 'filterOptions'] as const,
    reviewFormConfig: (type: string, lineItemId?: string) =>
      [...queryKeys.leads.all, 'reviewFormConfig', type, lineItemId] as const,
    reviewList: (lineItemId: string, filters?: Record<string, any>[]) =>
      [...queryKeys.leads.all, 'reviewList', lineItemId, filters] as const,
    validationStatuses: () => [...queryKeys.leads.all, 'validationStatuses'] as const,
    returnReasons: () => [...queryKeys.leads.all, 'returnReasons'] as const,
    leadStatuses: () => [...queryKeys.leads.all, 'leadStatuses'] as const,
    totalCount: (lineItemId: string) =>
      [...queryKeys.leads.all, 'totalCount', lineItemId] as const,
    totalFilteredCount: (lineItemId: string, filters: Record<string, any>[]) =>
      [...queryKeys.leads.all, 'totalFilteredCount', lineItemId, filters] as const,
  },
  deliverySchedules: {
    all: ['deliverySchedules'] as const,
    list: (lineItemId?: string) =>
      [...queryKeys.deliverySchedules.all, 'list', lineItemId] as const,
    logs: (scheduleId: string, params?: Record<string, any>) =>
      [...queryKeys.deliverySchedules.all, 'logs', scheduleId, params] as const,
    templateTypes: () =>
      [...queryKeys.deliverySchedules.all, 'templateTypes'] as const,
    templateList: (type: string) =>
      [...queryKeys.deliverySchedules.all, 'templateList', type] as const,
  },
  pacing: {
    all: ['pacing'] as const,
    summary: (lineItemId: string) =>
      [...queryKeys.pacing.all, 'summary', lineItemId] as const,
    data: (lineItemId: string, params?: Record<string, any>) =>
      [...queryKeys.pacing.all, 'data', lineItemId, params] as const,
    schedule: (params: FetchPacingScheduleParams) =>
      [...queryKeys.pacing.all, 'schedule', params] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params: { page: number; size: number; roleId?: string; username?: string; org?: string }) =>
      [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    withModuleAccess: (moduleName: string, tenantCode: string) =>
      [...queryKeys.users.all, 'withModuleAccess', moduleName, tenantCode] as const,
  },
  roles: {
    all: ['roles'] as const,
    lists: () => [...queryKeys.roles.all, 'list'] as const,
    list: (params: { page: number; size: number }) =>
      [...queryKeys.roles.lists(), params] as const,
    byType: (type: string) =>
      [...queryKeys.roles.all, 'byType', type] as const,
    permissions: (roleId: string) =>
      [...queryKeys.roles.all, 'permissions', roleId] as const,
    permissionsByAction: (actionId: string, moduleId: string) =>
      [...queryKeys.roles.all, 'permissionsByAction', actionId, moduleId] as const,
    modules: () => [...queryKeys.roles.all, 'modules'] as const,
  },
  organizations: {
    all: ['organizations'] as const,
    lists: () => [...queryKeys.organizations.all, 'list'] as const,
    list: (params: Record<string, any>) =>
      [...queryKeys.organizations.lists(), params] as const,
    details: () => [...queryKeys.organizations.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.organizations.details(), id] as const,
    byType: (type: string, userId?: string) =>
      [...queryKeys.organizations.all, 'byType', type, userId] as const,
    types: () => [...queryKeys.organizations.all, 'types'] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    charts: (type: string, filters: Record<string, any>) =>
      [...queryKeys.dashboard.all, 'charts', type, filters] as const,
    counts: (type: string, filters: Record<string, any>) =>
      [...queryKeys.dashboard.all, 'counts', type, filters] as const,
    filters: () => [...queryKeys.dashboard.all, 'filters'] as const,
    executiveGrid: (params: Record<string, any>) =>
      [...queryKeys.dashboard.all, 'executiveGrid', params] as const,
    filterData: () => [...queryKeys.dashboard.all, 'filterData'] as const,
  },
  jobs: {
    all: ['jobs'] as const,
    lists: () => [...queryKeys.jobs.all, 'list'] as const,
    list: (params: Record<string, any>) =>
      [...queryKeys.jobs.lists(), params] as const,
  },
  validationSettings: {
    all: ['validationSettings'] as const,
    list: (params: { page: number; size: number }) =>
      [...queryKeys.validationSettings.all, 'list', params] as const,
    metadata: () => [...queryKeys.validationSettings.all, 'metadata'] as const,
    config: (isEditing: boolean, info: Record<string, string | null> | null) =>
      [...queryKeys.validationSettings.all, 'config', isEditing, info] as const,
  },
  profile: {
    all: ['profile'] as const,
    detail: (userId: string) =>
      [...queryKeys.profile.all, 'detail', userId] as const,
  },
  integrations: {
    all: ['integrations'] as const,
    lists: () => [...queryKeys.integrations.all, 'list'] as const,
    config: (id: string) =>
      [...queryKeys.integrations.all, 'config', id] as const,
    types: () => [...queryKeys.integrations.all, 'types'] as const,
    detail: (id: string) =>
      [...queryKeys.integrations.all, 'detail', id] as const,
  },
  templates: {
    all: ['templates'] as const,
    lists: () => [...queryKeys.templates.all, 'list'] as const,
    list: (params: { page: number; size: number }) =>
      [...queryKeys.templates.lists(), params] as const,
    details: () => [...queryKeys.templates.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.templates.details(), id] as const,
    reservedNames: () => [...queryKeys.templates.all, 'reservedNames'] as const,
    destinationFields: (params: Record<string, any>) =>
      [...queryKeys.templates.all, 'destinationFields', params] as const,
    byMarketer: (marketerCode: string, lineItemId?: string) =>
      [...queryKeys.templates.all, 'byMarketer', marketerCode, lineItemId] as const,
    dataTypes: () => [...queryKeys.templates.all, 'dataTypes'] as const,
    dataMapperMetadata: () =>
      [...queryKeys.templates.all, 'dataMapperMetadata'] as const,
  },
  deliveryFile: {
    all: ['deliveryFile'] as const,
    download: (token: string) =>
      [...queryKeys.deliveryFile.all, 'download', token] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    supplierFilters: () => [...queryKeys.analytics.all, 'supplierFilters'] as const,
    supplierDashboard: (params: Record<string, any>) =>
      [...queryKeys.analytics.all, 'supplierDashboard', params] as const,
    marketerFilters: () => [...queryKeys.analytics.all, 'marketerFilters'] as const,
    marketerDashboard: (params: Record<string, any>) =>
      [...queryKeys.analytics.all, 'marketerDashboard', params] as const,
  },
  transformHistory: {
    all: ['transformHistory'] as const,
    list: (lineItemId: string, params: { page: number; size: number }) =>
      [...queryKeys.transformHistory.all, 'list', lineItemId, params] as const,
  },
  dzent: {
    all: ['dzent'] as const,
    conversations: () => [...queryKeys.dzent.all, 'conversations'] as const,
    organizations: (type: string) =>
      [...queryKeys.dzent.all, 'organizations', type] as const,
    conversationFiles: (conversationId: string) =>
      [...queryKeys.dzent.all, 'conversationFiles', conversationId] as const,
  },
  fileUpload: {
    all: ['fileUpload'] as const,
    metadata: (fileTypeName: string) =>
      [...queryKeys.fileUpload.all, 'metadata', fileTypeName] as const,
  },
  prefilledLists: {
    all: ['prefilledLists'] as const,
    basicDetails: (userId?: string) =>
      [...queryKeys.prefilledLists.all, 'basicDetails', userId] as const,
  },
  validationTemplates: {
    all: ['validationTemplates'] as const,
    byOrg: (orgCode: string) =>
      [...queryKeys.validationTemplates.all, 'byOrg', orgCode] as const,
  },
};
