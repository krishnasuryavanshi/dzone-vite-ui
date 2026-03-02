'use client';
import { Resource } from '@/lib/enums';
import {
  CampaignActionsEnum,
  ClientActionsEnum,
  DashboardActionsEnum,
  DeliveryTemplateActionsEnum,
  IntegrationsActionsEnum,
  LeadActionsEnum,
  LineItemActionsEnum,
  AnalyticsActionsEnum,
  OrganizationsActionsEnum,
  RoleActionsEnum,
  UserActionsEnum,
  LeadValidationSettingsActionsEnum,
  DzentActionsEnum,
  MarketersActionsEnum,
  SupplierActionEnum,
} from '@/lib/enums/permissions';
import { ViewJobPermissions } from '@/lib/enums/permissions';
import { ICustomResource } from '@/lib/types';
import {
  CampaignIcon,
  DashboardIcon,
  DeliveryIcon,
  DzentIcon,
  JobsIcon,
  OrganizationsIcon,
  UmsIcon,
  ValidationSettingsIcon,
} from '@/uicomponents/icons/svgs';
import { IResourceItem } from '@refinedev/core';

export const resources: IResourceItem[] = [
  {
    name: Resource.Organizations,
    list: '/organizations',
    meta: {
      label: 'pages.organizations.title',
      icon: <OrganizationsIcon />,
      permissions: [OrganizationsActionsEnum.View],
    },
  },
  {
    name: Resource.Dashboard,
    list: '/dashboard',
    meta: {
      label: 'pages.dashboard.title',
      icon: <DashboardIcon />,
      permissions: [DashboardActionsEnum.View],
    },
  },
  {
    name: Resource.Dzent,
    list: '/dzent',
    meta: {
      icon: <DzentIcon />,
      label: 'pages.dzent.title',
      permissions: [DzentActionsEnum.View],
    },
  },
  {
    name: Resource.DzoneAiAgent,
    list: '/dz-one-ai-coworker',
    meta: {
      icon: <DzentIcon />,
      label: 'pages.dzoneAiAgent.title',
      permissions: [DzentActionsEnum.ViewAICoworker],
    },
  },
  {
    name: Resource.CampaignManagement,
    meta: {
      label: 'pages.campaignManagement.title',
      icon: <CampaignIcon />,
      permissions: [
        ClientActionsEnum.View,
        CampaignActionsEnum.View,
        LineItemActionsEnum.View,
        LeadActionsEnum.View,
      ],
    },
  },
  // {
  //   name: Resource.Clients,
  //   list: '/campaign-management/clients',
  //   show: '/campaign-management/clients/:clientId',
  //   meta: {
  //     parent: Resource.CampaignManagement,
  //     label: 'pages.campaignManagement.clients.title',
  //     permissions: [ClientActionsEnum.View],
  //   },
  // },
  {
    name: Resource.Campaigns,
    list: '/campaign-management/campaigns',
    show: '/campaign-management/campaigns/:campaignId',
    meta: {
      parent: Resource.CampaignManagement,
      label: 'pages.campaignManagement.campaigns.title',
      permissions: [CampaignActionsEnum.View],
    },
  },
  {
    name: Resource.LineItems,
    list: '/campaign-management/line-items',
    show: '/campaign-management/line-items/:lineItemId',
    meta: {
      parent: Resource.CampaignManagement,
      label: 'pages.campaignManagement.lineItems.title',
      permissions: [LineItemActionsEnum.View],
    },
  },
  {
    name: Resource.Leads,
    list: '/campaign-management/leads',
    meta: {
      parent: Resource.CampaignManagement,
      label: 'pages.leads.title',
      permissions: [LeadActionsEnum.View],
    },
  },
  {
    name: Resource.IntegrationHub,
    meta: {
      label: 'pages.integrationHub.title',
      icon: <DeliveryIcon />,
      permissions: [
        DeliveryTemplateActionsEnum.View,
        IntegrationsActionsEnum.View,
      ],
    },
  },
  {
    name: Resource.Templates,
    list: '/integrations-hub/templates',
    meta: {
      parent: Resource.IntegrationHub,
      label: 'pages.templates.title',
      permissions: [DeliveryTemplateActionsEnum.View],
    },
  },
  {
    name: Resource.Integrations,
    list: '/integrations-hub/integrations',
    meta: {
      parent: Resource.IntegrationHub,
      label: 'pages.integrations.title',
      permissions: [IntegrationsActionsEnum.View],
    },
  },
  {
    name: Resource.LeadValidationSettings,
    list: '/lead-validation-settings',
    meta: {
      icon: <ValidationSettingsIcon />,
      label: 'pages.leadValidationSettings.title',
      permissions: [LeadValidationSettingsActionsEnum.View],
    },
  },
  {
    name: Resource.AdminConsole,
    meta: {
      label: 'pages.adminConsole.title',
      icon: <UmsIcon />,
      permissions: [RoleActionsEnum.View, UserActionsEnum.View],
    },
  },
  {
    name: Resource.Analytics,
    meta: {
      label: 'pages.analytics.title',
      icon: <DashboardIcon />,
      permissions: [
        AnalyticsActionsEnum.View,
        MarketersActionsEnum.View,
        SupplierActionEnum.View, // Replace with your permission
      ],
    },
  },
  {
    name: Resource.Marketers,
    list: '/analytics/marketers',
    meta: {
      parent: Resource.Analytics,
      label: 'Marketers',
      permissions: [MarketersActionsEnum.View],
    },
  },
  {
    name: Resource.Supplier,
    list: '/analytics/supplier',
    meta: {
      parent: Resource.Analytics,
      label: 'Supplier',
      permissions: [SupplierActionEnum.View],
    },
  },
  {
    name: Resource.RolesAndPermissions,
    list: '/ums/roles',
    meta: {
      parent: Resource.AdminConsole,
      label: 'pages.rolesAndPermissions.title',
      permissions: [RoleActionsEnum.View],
    },
  },
  {
    name: Resource.Users,
    list: '/ums/users',
    meta: {
      parent: Resource.AdminConsole,
      label: 'pages.users.title',
      permissions: [UserActionsEnum.View],
    },
  },
  {
    name: Resource.Jobs,
    list: '/jobs',
    meta: {
      label: 'Jobs',
      icon: <JobsIcon />,
      permissions: [ViewJobPermissions.Jobs],
    },
  },
];

// any custom route which in not listed in resources, add here

export const customResources: ICustomResource[] = [
  {
    name: Resource.Dzent,
    urls: ['/dzent/actions/:actionName'],
  },
  {
    name: Resource.Campaigns,
    urls: ['/campaign-management/campaigns/:campaignId/edit'],
  },
  {
    name: Resource.LineItems,
    urls: ['/campaign-management/line-items/:lineItemId/edit'],
  },
  {
    name: Resource.Templates,
    urls: [
      '/integrations-hub/templates/:templateId/update',
      '/integrations-hub/templates/create',
    ],
  },
  {
    name: Resource.LeadValidationSettings,
    urls: [
      '/lead-validation-settings/line-items/:lineItemId/:leadValidationSettingId/rules/:ruleName',
      '/lead-validation-settings/line-items/:lineItemId/:leadValidationSettingId',
      '/lead-validation-settings/organizations/:tenantCode/:leadValidationSettingId',
      '/lead-validation-settings/:leadValidationSettingId',
      '/lead-validation-settings/create',
    ],
  },
  {
    name: Resource.RolesAndPermissions,
    urls: ['/ums/roles/create', '/ums/roles/:id'],
  },
  {
    name: Resource.Users,
    urls: ['/ums/users/create', '/ums/users/:id'],
  },
];
