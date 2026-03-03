import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { AppLayout } from './layout/app-layout';
import { AuthLayout } from './layout/auth-layout';
import { ErrorFallback } from './components/shared/error-fallback';
import { NotFound } from './components/shared/not-found';

// ── Auth pages ──
const LoginPage = lazy(
  () => import('./app/(auth-pages)/login/page'),
);
const ForgotPasswordPage = lazy(
  () => import('./app/(auth-pages)/forgot-password/page'),
);

// ── Root pages (no layout) ──
const SetPasswordPage = lazy(
  () => import('./app/set-password/page'),
);
const UnauthorizedPage = lazy(
  () => import('./app/unauthorized/page'),
);

// ── Dashboard ──
const DashboardPage = lazy(
  () => import('./app/(dashboard)/dashboard/page'),
);
const ProfilePage = lazy(
  () => import('./app/(dashboard)/profile/page'),
);
const UsersListPage = lazy(
  () => import('./app/(dashboard)/users/page'),
);

// ── Campaign Management ──
const CampaignsPage = lazy(
  () => import('./app/(dashboard)/campaign-management/campaigns/page'),
);
const CampaignCreatePage = lazy(
  () => import('./app/(dashboard)/campaign-management/campaigns/create/page'),
);
const CampaignViewPage = lazy(
  () =>
    import(
      './app/(dashboard)/campaign-management/campaigns/[campaignId]/page'
    ),
);
const CampaignEditPage = lazy(
  () =>
    import(
      './app/(dashboard)/campaign-management/campaigns/[campaignId]/edit/page'
    ),
);

const LineItemsPage = lazy(
  () => import('./app/(dashboard)/campaign-management/line-items/page'),
);
const LineItemCreatePage = lazy(
  () => import('./app/(dashboard)/campaign-management/line-items/create/page'),
);
const LineItemViewPage = lazy(
  () =>
    import(
      './app/(dashboard)/campaign-management/line-items/[lineItemId]/page'
    ),
);
const LineItemEditPage = lazy(
  () =>
    import(
      './app/(dashboard)/campaign-management/line-items/[lineItemId]/edit/page'
    ),
);
const LineItemLeadsPage = lazy(
  () =>
    import(
      './app/(dashboard)/campaign-management/line-items/[lineItemId]/leads/page'
    ),
);
const LineItemDeliveryLogsPage = lazy(
  () =>
    import(
      './app/(dashboard)/campaign-management/line-items/[lineItemId]/delivery-logs/page'
    ),
);
const BatchLeadsPage = lazy(
  () =>
    import(
      './app/(dashboard)/campaign-management/line-items/[lineItemId]/batches/[batchId]/leads/page'
    ),
);

const LeadsPage = lazy(
  () => import('./app/(dashboard)/campaign-management/leads/page'),
);

// ── UMS ──
const UmsUsersPage = lazy(
  () => import('./app/(dashboard)/ums/users/page'),
);
const UmsUserCreatePage = lazy(
  () => import('./app/(dashboard)/ums/users/create/page'),
);
const UmsUserViewPage = lazy(
  () => import('./app/(dashboard)/ums/users/[userId]/page'),
);
const UmsRolesPage = lazy(
  () => import('./app/(dashboard)/ums/roles/page'),
);
const UmsRoleCreatePage = lazy(
  () => import('./app/(dashboard)/ums/roles/create/page'),
);
const UmsRoleViewPage = lazy(
  () => import('./app/(dashboard)/ums/roles/[roleId]/page'),
);

// ── Organizations (System Admin) ──
const OrganizationsPage = lazy(
  () =>
    import('./app/(dashboard)/(system-admin)/organizations/page'),
);
const OrganizationCreatePage = lazy(
  () =>
    import(
      './app/(dashboard)/(system-admin)/organizations/create/page'
    ),
);
const OrganizationViewPage = lazy(
  () =>
    import(
      './app/(dashboard)/(system-admin)/organizations/[organizationId]/page'
    ),
);

// ── Lead Validation Settings ──
const LeadValidationSettingsPage = lazy(
  () => import('./app/(dashboard)/lead-validation-settings/page'),
);
const LeadValidationSettingsCreatePage = lazy(
  () => import('./app/(dashboard)/lead-validation-settings/create/page'),
);
const LeadValidationSettingsLineItemPage = lazy(
  () =>
    import(
      './app/(dashboard)/lead-validation-settings/line-items/[lineItemId]/settings/[leadValidationSettingId]/page'
    ),
);
const LeadValidationSettingsOrgPage = lazy(
  () =>
    import(
      './app/(dashboard)/lead-validation-settings/organizations/[tenantCode]/settings/[leadValidationSettingId]/page'
    ),
);

// ── Analytics ──
const AnalyticsMarketersPage = lazy(
  () => import('./app/(dashboard)/analytics/marketers/page'),
);
const AnalyticsSupplierPage = lazy(
  () => import('./app/(dashboard)/analytics/supplier/page'),
);

// ── Integrations Hub ──
const IntegrationsPage = lazy(
  () => import('./app/(dashboard)/integrations-hub/integrations/page'),
);
const IntegrationViewPage = lazy(
  () => import('./app/(dashboard)/integrations-hub/integrations/[id]/page'),
);
const IntegrationTemplatesPage = lazy(
  () => import('./app/(dashboard)/integrations-hub/templates/page'),
);
const IntegrationTemplateCreatePage = lazy(
  () => import('./app/(dashboard)/integrations-hub/templates/create/page'),
);
const IntegrationTemplateUpdatePage = lazy(
  () =>
    import(
      './app/(dashboard)/integrations-hub/templates/[templateId]/update/page'
    ),
);
const DownloadFilePage = lazy(
  () => import('./app/(dashboard)/integrations-hub/download-file/page'),
);

// ── Dzent / AI ──
const DzentPage = lazy(
  () => import('./app/(dashboard)/dzent/page'),
);
const DzentActionPage = lazy(
  () => import('./app/(dashboard)/dzent/actions/[action]/page'),
);
const DzOneAICoworkerPage = lazy(
  () => import('./app/(dashboard)/dz-one-ai-coworker/page'),
);

// ── Jobs ──
const JobsPage = lazy(
  () => import('./app/(dashboard)/jobs/page'),
);

// ── Madtech Reports ──
// TODO: Add when page.tsx exists under madtech-reports

export const router = createBrowserRouter([
  // ── Auth routes ──
  {
    element: <AuthLayout />,
    errorElement: <ErrorFallback />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },

  // ── Standalone routes (no auth required) ──
  { path: '/set-password', element: <SetPasswordPage /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },

  // ── Dashboard routes (auth required) ──
  {
    element: <AppLayout />,
    errorElement: <ErrorFallback />,
    children: [
      // Root redirects to organizations
      { index: true, element: <Navigate to="/organizations" replace /> },

      // Dashboard
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/users', element: <UsersListPage /> },

      // Campaign Management
      {
        path: '/campaign-management',
        children: [
          { path: 'campaigns', element: <CampaignsPage /> },
          { path: 'campaigns/create', element: <CampaignCreatePage /> },
          { path: 'campaigns/:campaignId', element: <CampaignViewPage /> },
          {
            path: 'campaigns/:campaignId/edit',
            element: <CampaignEditPage />,
          },
          { path: 'line-items', element: <LineItemsPage /> },
          { path: 'line-items/create', element: <LineItemCreatePage /> },
          { path: 'line-items/:lineItemId', element: <LineItemViewPage /> },
          {
            path: 'line-items/:lineItemId/edit',
            element: <LineItemEditPage />,
          },
          {
            path: 'line-items/:lineItemId/leads',
            element: <LineItemLeadsPage />,
          },
          {
            path: 'line-items/:lineItemId/delivery-logs',
            element: <LineItemDeliveryLogsPage />,
          },
          {
            path: 'line-items/:lineItemId/batches/:batchId/leads',
            element: <BatchLeadsPage />,
          },
          { path: 'leads', element: <LeadsPage /> },
        ],
      },

      // UMS
      {
        path: '/ums',
        children: [
          { path: 'users', element: <UmsUsersPage /> },
          { path: 'users/create', element: <UmsUserCreatePage /> },
          { path: 'users/:userId', element: <UmsUserViewPage /> },
          { path: 'roles', element: <UmsRolesPage /> },
          { path: 'roles/create', element: <UmsRoleCreatePage /> },
          { path: 'roles/:roleId', element: <UmsRoleViewPage /> },
        ],
      },

      // Organizations (System Admin)
      { path: '/organizations', element: <OrganizationsPage /> },
      { path: '/organizations/create', element: <OrganizationCreatePage /> },
      {
        path: '/organizations/:organizationId',
        element: <OrganizationViewPage />,
      },

      // Lead Validation Settings
      {
        path: '/lead-validation-settings',
        element: <LeadValidationSettingsPage />,
      },
      {
        path: '/lead-validation-settings/create',
        element: <LeadValidationSettingsCreatePage />,
      },
      {
        path: '/lead-validation-settings/line-items/:lineItemId/settings/:leadValidationSettingId',
        element: <LeadValidationSettingsLineItemPage />,
      },
      {
        path: '/lead-validation-settings/organizations/:tenantCode/settings/:leadValidationSettingId',
        element: <LeadValidationSettingsOrgPage />,
      },

      // Analytics
      { path: '/analytics/marketers', element: <AnalyticsMarketersPage /> },
      { path: '/analytics/supplier', element: <AnalyticsSupplierPage /> },

      // Integrations Hub
      {
        path: '/integrations-hub',
        children: [
          { path: 'integrations', element: <IntegrationsPage /> },
          { path: 'integrations/:id', element: <IntegrationViewPage /> },
          { path: 'templates', element: <IntegrationTemplatesPage /> },
          {
            path: 'templates/create',
            element: <IntegrationTemplateCreatePage />,
          },
          {
            path: 'templates/:templateId/update',
            element: <IntegrationTemplateUpdatePage />,
          },
          { path: 'download-file', element: <DownloadFilePage /> },
        ],
      },

      // Dzent / AI
      { path: '/dzent', element: <DzentPage /> },
      { path: '/dzent/actions/:action', element: <DzentActionPage /> },
      { path: '/dz-one-ai-coworker', element: <DzOneAICoworkerPage /> },

      // Jobs
      { path: '/jobs', element: <JobsPage /> },
    ],
  },

  // ── Catch-all 404 ──
  { path: '*', element: <NotFound /> },
]);
