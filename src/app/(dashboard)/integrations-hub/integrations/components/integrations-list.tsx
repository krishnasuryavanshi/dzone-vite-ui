'use client';

import { HasPermission } from '@/components/auth/has-permission';
import { DzBox } from '@/components/layout/v1/dz-box';
import {
  FTPIcon,
  HubspotIcon,
  PipedriveIcon,
  SalesforceIcon,
  ZapierIcon,
  ZohoCrmIcon,
} from '@/components/uicomponents/icons/svgs';
import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { IntegrationsActionsEnum } from '@/lib/enums/permissions';
import { showNotification } from '@/services';
import { nextBackendRequest } from '@/services/backend-request';
import { Button, Spin, Text } from '@/uicomponents';
import { WebformIcon } from '@/uicomponents/icons/svgs/webform';
import { Flex, Space } from '@/uicomponents/layout';
import { Col, Row } from '@/uicomponents/layout/grid';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Integration, IntegrationType } from '../lib/types/integration';
import { fetchIntegrations, fetchIntegrationTypes } from '../services';
import { CreateIntegrationModal } from './create-integration-modal';
import { HubSpotIntegrationDetails } from './hubspot-integration-details';
import styles from './integrations-list.module.css';
import { WebFormIntegrationDetails } from './webform-integration-details';
import { ZapierIntegrationDetails } from './zapier-integration-details';
import { FtpIntegrationDetails } from './ftp-integration-details';
import { DeliveryType } from '@/app/(dashboard)/integrations-hub/templates/lib/enums';

const DefaultLogo = () => (
  <svg width='32' height='32' viewBox='0 0 32 32' fill='none'>
    <circle cx='16' cy='16' r='16' fill='#8C8C8C' />
    <text x='16' y='21' textAnchor='middle' fill='white' fontSize='16'>
      API
    </text>
  </svg>
);

const getIntegrationLogo = (type?: string, name?: string): React.ReactNode => {
  // Use icon components based on type
  if (type === 'HubSpot') return <HubspotIcon />;
  if (type === 'Salesforce') return <SalesforceIcon />;
  if (type === 'Zoho CRM') return <ZohoCrmIcon />;
  if (type === 'Pipedrive') return <PipedriveIcon />;
  if (type === 'WebForm') return <WebformIcon />;
  if (type === 'Zapier') return <ZapierIcon />;
  if (type === 'FTP') return <FTPIcon />;

  // Fallback to checking name if type doesn't match
  if (name) {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('hubspot')) return <HubspotIcon />;
    if (lowerName.includes('salesforce')) return <SalesforceIcon />;
    if (lowerName.includes('zoho')) return <ZohoCrmIcon />;
    if (lowerName.includes('pipedrive')) return <PipedriveIcon />;
    if (lowerName.includes('webform')) return <WebformIcon />;
    if (lowerName.includes('zapier')) return <ZapierIcon />;
    if (lowerName.includes('ftp')) return <FTPIcon />;
  }

  return <DefaultLogo />;
};

export const IntegrationsList: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [integrationTypes, setIntegrationTypes] = useState<IntegrationType[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedIntegrationType, setSelectedIntegrationType] =
    useState<string>('');
  const [modalMode, setModalMode] = useState<'create' | 'retry'>('create');
  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load both integrations and integration types in parallel
      const [integrationsResponse, typesResponse] = await Promise.all([
        fetchIntegrations(),
        fetchIntegrationTypes(),
      ]);

      setIntegrations(integrationsResponse.data || []);
      setIntegrationTypes(typesResponse.data || []);
    } catch (err) {
      setError('Failed to load integrations. Please try again later.');
      // console.error('Error loading integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    integrationId: string,
    newStatus: 'Active' | 'Inactive',
  ) => {
    try {
      setDisconnecting(integrationId);
      await nextBackendRequest({
        resource: `${ApiResources.Integrations}/${integrationId}`,
        apiHost: ApiHost.PlatformService,
        method: HttpMethod.PUT,
        data: { status: newStatus },
      });

      const action = newStatus === 'Active' ? 'connected' : 'disconnected';
      showNotification({
        message: `Integration ${action} successfully`,
        type: 'success',
      });

      // Reload the integrations list
      await loadData();
    } catch (error) {
      const action = newStatus === 'Active' ? 'connect' : 'disconnect';
      showNotification({
        message: `Failed to ${action} integration`,
        type: 'error',
      });
    } finally {
      setDisconnecting(null);
    }
  };

  const handleCreateIntegration = (integrationType: string) => {
    setSelectedIntegrationType(integrationType);
    setModalMode('create');
    setSelectedIntegration(null);
    setCreateModalOpen(true);
  };

  const handleRetryIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    setSelectedIntegrationType(integration.type);
    setModalMode('retry');
    setCreateModalOpen(true);
  };

  const handleModalClose = () => {
    setCreateModalOpen(false);
    setSelectedIntegrationType('');
    setSelectedIntegration(null);
    setModalMode('create');
  };

  const handleModalSuccess = () => {
    setCreateModalOpen(false);
    setSelectedIntegrationType('');
    setSelectedIntegration(null);
    setModalMode('create');
    loadData(); // Refresh the integrations list
  };

  // Show error notification when error occurs - must be before any returns
  useEffect(() => {
    if (error) {
      showNotification({
        message: error,
        type: 'error',
      });
    }
  }, [error]);

  if (loading) {
    return (
      <DzBox
        className={styles.integrationsList}
        style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size='large' />
        <Text style={{ display: 'block', marginTop: '16px' }}>
          Loading integrations...
        </Text>
      </DzBox>
    );
  }

  if (error) {
    return (
      <DzBox
        className={styles.integrationsList}
        style={{ textAlign: 'center', padding: '40px' }}>
        <Text
          style={{ display: 'block', marginBottom: '16px', color: '#ff4d4f' }}>
          {error}
        </Text>
        <Button type='primary' onClick={loadData}>
          Retry
        </Button>
      </DzBox>
    );
  }

  // Show all integrations from API as connected integrations
  const connectedIntegrations = integrations;

  // For available integrations, use integration types from API
  const availableIntegrations = integrationTypes.map((type) => ({
    ...type,
    description: '',
    delivery_type: '',
    config: {},
    tenant_code: '',
    status: 'inactive',
    created_at: '',
    updated_at: '',
    created_by: '',
    updated_by: '',
  }));

  return (
    <DzBox className={styles.integrationsList}>
      {/* Connected Integrations Section */}
      {connectedIntegrations.length > 0 && (
        <>
          <Text className={styles.sectionTitle}>Connected Integrations</Text>

          <DzBox className={styles.connectedIntegrationsTable}>
            {connectedIntegrations.map((integration) => (
              <DzBox
                key={integration.id}
                className={styles.connectedIntegrationItem}>
                {/* First Row: Logo, Name, Status, and Add New button */}
                <DzBox className={styles.integrationHeaderRow}>
                  <DzBox className={styles.integrationInfo}>
                    <Space align='center' size={12}>
                      {getIntegrationLogo(integration.type, integration.name)}
                      <DzBox className={styles.integrationNameStatus}>
                        <Text className={styles.integrationConnectedName}>
                          {integration.type}
                        </Text>
                        <Space align='center' size={8}>
                          <Text
                            className={
                              integration.status === 'Inactive' ||
                              integration.status === 'Failed'
                                ? styles.statusError
                                : styles.statusTag
                            }>
                            {integration.status === 'Active'
                              ? 'Connected'
                              : integration.status === 'Inactive'
                                ? 'Disconnected'
                                : integration.status === 'Failed'
                                  ? 'Failed Connecting'
                                  : integration.status}
                          </Text>
                          {integration.status === 'Failed' && (
                            <HasPermission
                              permissions={IntegrationsActionsEnum.Edit}>
                              <Button
                                type='link'
                                size='small'
                                className={styles.retryLink}
                                onClick={() =>
                                  handleRetryIntegration(integration)
                                }>
                                Retry
                              </Button>
                            </HasPermission>
                          )}
                        </Space>
                      </DzBox>
                    </Space>
                  </DzBox>
                </DzBox>

                {/* Second Row: Additional details with light background */}
                <DzBox className={styles.integrationDetailsRow}>
                  {integration.type === DeliveryType.WEBFORM ? (
                    <WebFormIntegrationDetails
                      name={integration.name}
                      url={integration.url}
                    />
                  ) : integration.type === DeliveryType.ZAPIER ? (
                    <ZapierIntegrationDetails
                      name={integration.name}
                      url={integration.url}
                      label={integration.label}
                    />
                  ) : integration.type === DeliveryType.FTP ? (
                    <FtpIntegrationDetails
                      name={integration.name}
                      type={integration.type}
                    />
                  ) : (
                    <HubSpotIntegrationDetails
                      name={integration.name}
                      label={integration.label}
                      connectionType={integration.connectionType}
                    />
                  )}

                  <DzBox className={styles.detailsRight}>
                    <HasPermission permissions={IntegrationsActionsEnum.Edit}>
                      {integration.status === 'Inactive' ? (
                        <Button
                          type='link'
                          className={styles.connectLink}
                          loading={disconnecting === integration.id}
                          onClick={() =>
                            handleUpdateStatus(integration.id, 'Active')
                          }>
                          Connect
                        </Button>
                      ) : integration.status === 'Active' ? (
                        <Button
                          type='link'
                          className={styles.disconnectLink}
                          danger
                          loading={disconnecting === integration.id}
                          onClick={() =>
                            handleUpdateStatus(integration.id, 'Inactive')
                          }>
                          Disconnect
                        </Button>
                      ) : null}
                    </HasPermission>
                    <HasPermission permissions={IntegrationsActionsEnum.View}>
                      <Link
                        href={`/integrations-hub/integrations/${integration.id}`}>
                        <Button type='link' className={styles.viewDetailsLink}>
                          View Details
                        </Button>
                      </Link>
                    </HasPermission>
                  </DzBox>
                </DzBox>
              </DzBox>
            ))}
          </DzBox>
        </>
      )}
      {/* Available Integrations Section */}
      {availableIntegrations.length > 0 && (
        <>
          <Text className={styles.availableSectionTitle}>
            Available Integrations
          </Text>
          <Row gutter={[16, 16]} className={styles.availableIntegrations}>
            {availableIntegrations.map((integration) => (
              <Col key={integration.id} span={12}>
                <DzBox className={styles.integrationItem}>
                  <Space align='center'>
                    <Flex align='center' justify='center'>
                      {getIntegrationLogo(integration.type, integration.name)}
                    </Flex>
                    <Text className={styles.integrationName}>
                      {integration.name}
                    </Text>
                  </Space>
                  <HasPermission permissions={IntegrationsActionsEnum.Create}>
                    <Button
                      type='primary'
                      size='small'
                      className={styles.connectButton}
                      onClick={() => handleCreateIntegration(integration.name)}>
                      Add
                    </Button>
                  </HasPermission>
                </DzBox>
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* Create Integration Modal */}
      <CreateIntegrationModal
        open={createModalOpen}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
        integrationType={selectedIntegrationType}
        mode={modalMode}
        integration={selectedIntegration}
      />
    </DzBox>
  );
};
