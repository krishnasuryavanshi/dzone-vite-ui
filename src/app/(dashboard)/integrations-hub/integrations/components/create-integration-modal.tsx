import { Button, Form, Modal, Title, useForm } from '@/uicomponents';
import { FC, useState, useEffect, useRef } from 'react';
import { Flex } from '@/uicomponents/layout';
import { HubspotIcon } from '@/components/uicomponents/icons/svgs/hubspot';
import { WebformIcon } from '@/components/uicomponents/icons/svgs/webform';
import { ZapierIcon } from '@/components/uicomponents/icons/svgs/zapier-icon';
import { HubSpotFormContent } from './hubspot-form-content';
import { WebFormContent } from './webform-form-content';
import { ZapierFormContent } from './zapier-form-content';
import { FtpFormContent, FtpFormContentRef } from './ftp-form-content';
import { IntegrationLabel } from '@/lib/enums';
import { IntegrationTypes } from '../lib/enums';
import { DeliveryType } from '@/app/(dashboard)/integrations-hub/templates/lib/enums';
import { createIntegration, updateIntegration } from '../services';
import { showNotification } from '@/services';
import { Integration } from '../lib/types/integration';
import styles from './create-integration-modal.module.css';
import { FTPIcon } from '@/uicomponents/icons/svgs';

interface CreateIntegrationModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  integrationType?: string;
  mode?: 'create' | 'retry';
  integration?: Integration | null;
}

export const CreateIntegrationModal: FC<CreateIntegrationModalProps> = ({
  open,
  onCancel,
  onSuccess,
  integrationType = IntegrationTypes.HubSpot,
  mode = 'create',
  integration = null,
}) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const ftpFormRef = useRef<FtpFormContentRef>(null);

  const isWebForm = integrationType === DeliveryType.WEBFORM;
  const isZapier = integrationType === DeliveryType.ZAPIER;
  const isFtp = integrationType === DeliveryType.FTP;

  useEffect(() => {
    if (open) {
      // Always reset the form first when modal opens
      form.resetFields();

      if (mode === 'retry' && integration) {
        const fieldValues: any = {
          name: integration.name,
        };

        if (isWebForm) {
          fieldValues.url = ''; // Keep URL empty for user to enter
          fieldValues.script = integration.script || ''; // Add script field
        } else if (isZapier) {
          fieldValues.url = ''; // Keep URL empty for user to enter
          fieldValues.label = integration.label || '';
          fieldValues.headers = integration.headers || '';
        } else if (isFtp) {
          // Extract from config object for FTP
          const config: any = integration.config || {};
          fieldValues.host = config.host || '';
          fieldValues.port = config.port || 22;
          fieldValues.userName = config.username || '';
          fieldValues.password = ''; // Keep password empty for security
          fieldValues.privateKeyFileId = config.privateKeyFileId || '';
          fieldValues.privateKeyPassword = ''; // Keep passphrase empty for security
          fieldValues.remotePath = config.remotePath || ''; // Add remotePath
        } else {
          fieldValues.label = integration.label;
          fieldValues.apiKey = ''; // Keep API key empty for user to enter
        }

        form.setFieldsValue(fieldValues);
      } else if (mode === 'create') {
        if (!isWebForm && !isZapier && !isFtp) {
          form.setFieldsValue({
            label: IntegrationLabel.PRODUCTION,
          });
        }
        // For FTP, ensure port has default value and clear file ID
        if (isFtp) {
          form.setFieldsValue({
            port: 22,
            privateKeyFileId: undefined,
          });
        }
      }
    }
  }, [open, mode, integration, form, isWebForm, isZapier, isFtp]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      let result;
      if (mode === 'create') {
        const payload: any = {
          name: values.name,
          type: integrationType,
        };

        if (isWebForm) {
          payload.url = values.url;
          payload.script = values.script;
        } else if (isZapier) {
          payload.url = values.url;
          payload.label = values.label;
          payload.description = DeliveryType.ZAPIER;
          payload.config = {
            headers: values.headers ? JSON.parse(values.headers) : {},
          };
        } else if (isFtp) {
          // Build config based on auth method
          const config: any = {
            host: values.host,
            port: values.port,
            username: values.userName,
          };

          // Add auth credentials (password or private key)
          if (values.password) {
            config.password = values.password;
          }
          if (values.privateKeyFileId) {
            config.privateKeyFileId = values.privateKeyFileId;
          }
          if (values.privateKeyPassword) {
            config.privateKeyPassword = values.privateKeyPassword;
          }
          if (values.remotePath) {
            config.remotePath = values.remotePath;
          }

          payload.config = config;
        } else {
          payload.label = values.label;
          payload.apiKey = values.apiKey;
        }

        result = await createIntegration(payload);
        if (result) {
          showNotification({
            message: 'Integration created successfully',
            type: 'success',
          });
        } else {
          showNotification({
            message: 'Failed to create integration',
            type: 'error',
          });
        }
      } else if (mode === 'retry' && integration) {
        const updatePayload: any = {
          name: values.name,
        };

        if (isWebForm) {
          updatePayload.url = values.url;
          updatePayload.script = values.script;
        } else if (isZapier) {
          updatePayload.url = values.url;
          updatePayload.label = values.label;
          updatePayload.description = DeliveryType.ZAPIER;
          updatePayload.config = {
            headers: values.headers ? JSON.parse(values.headers) : {},
          };
        } else if (isFtp) {
          // Build config based on auth method
          const config: any = {
            host: values.host,
            port: values.port,
            username: values.userName,
          };

          // Add auth credentials (password or private key)
          if (values.password) {
            config.password = values.password;
          }
          if (values.privateKeyFileId) {
            config.privateKeyFileId = values.privateKeyFileId;
          }
          if (values.privateKeyPassword) {
            config.privateKeyPassword = values.privateKeyPassword;
          }
          if (values.remotePath) {
            config.remotePath = values.remotePath;
          }
          updatePayload.config = config;
        } else {
          updatePayload.label = values.label;
          updatePayload.apiKey = values.apiKey;
        }

        result = await updateIntegration(integration.id, updatePayload);
        if (result) {
          showNotification({
            message: 'Integration updated and retry initiated',
            type: 'success',
          });
        } else {
          showNotification({
            message: 'Failed to update integration',
            type: 'error',
          });
        }
      }

      if (result) {
        form.resetFields();
        onSuccess();
      }
    } catch (error) {
      const action = mode === 'create' ? 'create' : 'update';
      showNotification({
        message: `Failed to ${action} integration`,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset the form completely
    form.resetFields();
    // Clear all field values explicitly, including file IDs
    form.setFieldsValue({
      privateKeyFileId: undefined,
    });
    // Reset file upload state for FTP
    if (isFtp && ftpFormRef.current?.resetFiles) {
      ftpFormRef.current.resetFiles();
    }
    onCancel();
  };

  return (
    <Modal
      width={512}
      open={open}
      onCancel={handleCancel}
      maskClosable={false}
      title={null}
      footer={null}
      centered
      className={styles.createIntegrationModal}>
      <div className={styles.modalContent}>
        <div className={styles.iconContainer}>
          {isWebForm ? (
            <WebformIcon />
          ) : isZapier ? (
            <ZapierIcon />
          ) : isFtp ? (
            <FTPIcon />
          ) : (
            <HubspotIcon />
          )}
        </div>

        <Title level={3} className={styles.modalTitle}>
          {mode === 'create'
            ? `Connect to ${integrationType}`
            : `Retry ${integrationType} Connection`}
        </Title>

        <p className={styles.modalSubtitle}>
          {mode === 'create'
            ? isWebForm
              ? 'Connect your Webform for seamless lead Transfer'
              : isZapier
                ? 'Connect your Zapier for seamless lead Transfer'
                : isFtp
                  ? 'Connect your FTP to securely automate data transfers between DZ One and your systems'
                  : `Connect your ${integrationType} for seamless lead management`
            : isWebForm
              ? 'Update your WebForm URL to retry the connection'
              : isZapier
                ? 'Update your Zapier configuration to retry the connection'
                : isFtp
                  ? 'Update your FTP configuration to retry the connection'
                  : `Update your ${integrationType} API Key to retry the connection`}
        </p>

        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmit}
          autoComplete='off'
          initialValues={
            !isWebForm && !isZapier && !isFtp
              ? { label: IntegrationLabel.PRODUCTION }
              : undefined
          }>
          {isWebForm ? (
            <WebFormContent mode={mode} />
          ) : isZapier ? (
            <ZapierFormContent mode={mode} />
          ) : isFtp ? (
            <FtpFormContent
              ref={ftpFormRef}
              mode={mode}
              form={form}
              open={open}
            />
          ) : (
            <HubSpotFormContent mode={mode} integrationType={integrationType} />
          )}

          <Flex className={styles.buttonContainer}>
            <Button
              onClick={handleCancel}
              disabled={loading}
              className={styles.cancelButton}>
              Cancel
            </Button>
            <Button
              type='primary'
              htmlType='submit'
              loading={loading}
              className={styles.submitButton}>
              {mode === 'create' ? 'Save and Connect' : 'Update and Retry'}
            </Button>
          </Flex>
        </Form>
      </div>
    </Modal>
  );
};
