
import { REQUIRED_FIELD } from '@/app/(dashboard)/campaign-management/lib/constants';
import { Translate } from '@/components/i18n';
import { DzBox } from '@/components/layout/v1';
import { Hideable } from '@/components/shared';
import { DeliveryTemplateActionsEnum } from '@/lib/enums/permissions';
import { usePermissionCheck } from '@/lib/hooks';
import { FormInstance, FormItem } from '@/uicomponents/form';
import { Select } from '@/uicomponents/form/input';
import { Col, Row } from '@/uicomponents/layout/grid';
import { Text } from '@/uicomponents/text';
import { FC, useEffect, useState } from 'react';
import { DeliveryTypeOptions } from '../../../../lib/constants';
import { DeliveryType } from '../../../../lib/enums';
import {
  fetchDeliveryObjects,
  fetchIntegrationLabels,
} from '../../../../services';
import { fetchZapierIntegrationLabels } from '../../../../services/fetch-zapier-integration-labels';
import { useTemplateStore } from '../../../../stores';
import { HubSpotDeliveryFields } from '../../hubspot-delivery-fields';
import { IntegrationNameField } from '../../integration-name-field';
import { PreviewLink } from '../../preview-link';
import { ZapierTypeField } from '../../zapier-type-field';

interface DeliveryDetailSectionProps {
  form: FormInstance;
  templateId?: string;
}

export const DeliveryDetailSection: FC<DeliveryDetailSectionProps> = ({
  form,
  templateId,
}) => {
  const {
    deliveryType,
    setDeliveryType,
    updateTemplateData,
    templateData,
    updateIntegrationsList,
    updateFormFieldMappingOptions,
    updateMasterFieldMappings,
  } = useTemplateStore();

  const [integrationOptions, setIntegrationOptions] = useState<
    { label: string; value: string; url?: string }[]
  >([]);
  const [deliveryObjectOptions, setDeliveryObjectOptions] = useState<
    {
      label: string;
      value: string;
      id: string;
      name: string;
      fieldCount: any;
    }[]
  >([]);
  const [isInitializing] = useState<boolean>(false);
  const [zapierType, setZapierType] = useState<string | undefined>(
    templateData?.type,
  );

  const isEditTemplateAllowed = usePermissionCheck(
    DeliveryTemplateActionsEnum.Edit,
  );

  const fetchIntegrationOptions = async (value: string) => {
    try {
      const response = await fetchIntegrationLabels(value);
      if (response?.data) {
        updateIntegrationsList(value, response.data);
        const options = response.data.map(
          (integration: { id: string; name: string; url?: string }) => ({
            label: integration.name,
            value: integration.id,
            url: integration.url || '',
          }),
        );
        setIntegrationOptions(options);
      }
    } catch (error) {
      setIntegrationOptions([]);
    }
  };

  const fetchZapierIntegrationOptions = async (type: string) => {
    try {
      const response = await fetchZapierIntegrationLabels(
        DeliveryType.ZAPIER,
        type,
      );
      if (response?.data) {
        updateIntegrationsList(DeliveryType.ZAPIER, response.data);
        const options = response.data.map(
          (integration: { id: string; name: string; url?: string }) => ({
            label: integration.name,
            value: integration.id,
            url: integration.url || '',
          }),
        );
        setIntegrationOptions(options);
      }
    } catch (error) {
      setIntegrationOptions([]);
    }
  };

  const handleZapierTypeChange = (type: string) => {
    setZapierType(type);
    updateTemplateData({ type: type as 'Zaps' | 'Interfaces' });
    form.setFieldsValue({
      integrationId: undefined,
    });
    setIntegrationOptions([]);
    // Fetch integration options based on selected zapier type
    fetchZapierIntegrationOptions(type);
  };

  const fetchDeliveryObjectOptions = async (
    type: string,
    integrationId: string,
  ) => {
    try {
      const response = await fetchDeliveryObjects(type, integrationId);
      if (response?.data?.forms) {
        const options = response.data.forms.map(
          (object: { id: string; name: string; fieldCount: any }) => ({
            label: object.name,
            value: object.id,
            id: object.id,
            name: object.name,
            fieldCount: object.fieldCount || 0,
          }),
        );
        setDeliveryObjectOptions(options);
      }
    } catch (error) {
      setDeliveryObjectOptions([]);
    }
  };

  const handleDeliveryTypeChange = (value: string) => {
    setDeliveryType(value);
    form.setFieldsValue({
      integrationId: undefined,
      selectedDeliveryObjectId: undefined,
      deliveryObject: undefined,
    });
    updateTemplateData({
      deliveryType: value,
      integrationId: undefined,
      deliveryObject: undefined,
      type: undefined,
    });
    setIntegrationOptions([]);
    setDeliveryObjectOptions([]);
    updateFormFieldMappingOptions([]);
    updateMasterFieldMappings([]);
    setZapierType(undefined);

    // For HubSpot, WebForm, and FTP, fetch integrations immediately
    if (
      value === DeliveryType.HUBSPOT ||
      value === DeliveryType.WEBFORM ||
      value === DeliveryType.FTP
    ) {
      fetchIntegrationOptions(value);
    }
  };

  // Fetch integration options for existing template
  useEffect(() => {
    if (templateData?.deliveryType) {
      if (
        templateData.deliveryType === DeliveryType.ZAPIER &&
        templateData.type &&
        templateData.type !== 'default'
      ) {
        // For Zapier, set the type and fetch integrations based on type
        setZapierType(templateData.type);
        fetchZapierIntegrationOptions(templateData.type);
      } else if (templateData.deliveryType === DeliveryType.ZAPIER) {
        // Clear zapier type when it's default
        setZapierType(undefined);
      } else if (
        templateData.deliveryType === DeliveryType.HUBSPOT ||
        templateData.deliveryType === DeliveryType.WEBFORM ||
        templateData.deliveryType === DeliveryType.FTP
      ) {
        fetchIntegrationOptions(templateData.deliveryType);
      }
    }
  }, [templateData?.deliveryType, templateData?.type]);

  return (
    <DzBox dzOneBox style={{ marginBottom: '1rem' }}>
      <Text
        style={{
          fontWeight: '600',
        }}>
        Delivery Detail
      </Text>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <FormItem
            className='input-control form-control-item'
            name='deliveryType'
            label={
              <Text>
                <Translate i18nKey='pages.templates.label.deliveryType' />
              </Text>
            }
            rules={[{ required: true, message: REQUIRED_FIELD }]}>
            <Select
              placeholder='Select Delivery Type'
              style={{ width: '100%' }}
              options={DeliveryTypeOptions}
              onChange={handleDeliveryTypeChange}
              disabled={Boolean(templateId && !isEditTemplateAllowed)}
              allowClear
              value={deliveryType || undefined}
            />
          </FormItem>
        </Col>

        {/* Zapier: Source Type field (appears first when Zapier is selected) */}
        <Hideable show={deliveryType === DeliveryType.ZAPIER}>
          <ZapierTypeField
            templateId={templateId}
            isEditTemplateAllowed={isEditTemplateAllowed}
            onTypeChange={handleZapierTypeChange}
            zapierType={zapierType}
          />
        </Hideable>

        {/* Integration Name for HubSpot, WebForm, and FTP */}
        <Hideable
          show={
            deliveryType === DeliveryType.HUBSPOT ||
            deliveryType === DeliveryType.WEBFORM ||
            deliveryType === DeliveryType.FTP
          }>
          <IntegrationNameField
            form={form}
            templateId={templateId}
            templateData={templateData}
            isEditTemplateAllowed={isEditTemplateAllowed}
            isInitializing={isInitializing}
            integrationOptions={integrationOptions}
            deliveryType={deliveryType}
            zapierType={zapierType}
            setDeliveryObjectOptions={setDeliveryObjectOptions}
            updateTemplateData={updateTemplateData}
            fetchDeliveryObjectOptions={fetchDeliveryObjectOptions}
            fetchWebformFormFieldsData={() => {
              // No-op for Step 1 - AI mapping happens on button click
            }}
          />
          <Hideable show={deliveryType === DeliveryType.WEBFORM}>
            <PreviewLink
              integrationId={form.getFieldValue('integrationId')}
              style={{ marginTop: '3rem' }}
            />
          </Hideable>
        </Hideable>

        {/* Integration Name for Zapier (only after Source Type is selected) */}
        <Hideable show={deliveryType === DeliveryType.ZAPIER && !!zapierType}>
          <IntegrationNameField
            form={form}
            templateId={templateId}
            templateData={templateData}
            isEditTemplateAllowed={isEditTemplateAllowed}
            isInitializing={isInitializing}
            integrationOptions={integrationOptions}
            deliveryType={deliveryType}
            zapierType={zapierType}
            setDeliveryObjectOptions={setDeliveryObjectOptions}
            updateTemplateData={updateTemplateData}
            fetchDeliveryObjectOptions={fetchDeliveryObjectOptions}
            fetchWebformFormFieldsData={() => {
              // No-op for Step 1 - AI mapping happens on button click
            }}
          />
        </Hideable>

        <Hideable show={deliveryType === DeliveryType.HUBSPOT}>
          <HubSpotDeliveryFields
            form={form}
            templateId={templateId}
            isEditTemplateAllowed={isEditTemplateAllowed}
            deliveryObjectOptions={deliveryObjectOptions}
            deliveryType={deliveryType}
            updateTemplateData={updateTemplateData}
            fetchFormFieldsData={() => {
              // No-op for Step 1 - AI mapping happens on button click
            }}
          />
        </Hideable>
      </Row>
    </DzBox>
  );
};
