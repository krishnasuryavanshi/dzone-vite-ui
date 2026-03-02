'use client';

import { FC } from 'react';
import { FormItem, FormInstance } from '@/uicomponents/form';
import { Select } from '@/uicomponents/form/input';
import { Col } from '@/uicomponents/layout/grid';
import { Text } from '@/uicomponents';
import { Translate } from '@/components/i18n';
import { REQUIRED_FIELD } from '@/app/(dashboard)/campaign-management/lib/constants';
import { DeliveryType } from '../../lib/enums';
import { PreviewLink } from './preview-link';
import { Space } from '@/uicomponents/layout';
import { ZapierType } from '../../../integrations/lib/constants/zapier-types';

interface IntegrationNameFieldProps {
  form: FormInstance;
  templateId?: string;
  templateData?: any;
  isEditTemplateAllowed: boolean;
  isInitializing: boolean;
  integrationOptions: { label: string; value: string }[];
  deliveryType: string;
  zapierType?: string;
  setDeliveryObjectOptions: (options: any[]) => void;
  updateTemplateData: (data: any) => void;
  fetchDeliveryObjectOptions: (
    deliveryType: string,
    integrationId: string,
    shouldUpdateMappings?: boolean,
  ) => void;

  fetchWebformFormFieldsData: (
    type: string,
    integrationId: string,
    shouldUpdateMappings?: boolean,
  ) => void;
}

export const IntegrationNameField: FC<IntegrationNameFieldProps> = ({
  form,
  templateId,
  templateData,
  isEditTemplateAllowed,
  isInitializing,
  integrationOptions,
  deliveryType,
  zapierType,
  setDeliveryObjectOptions,
  updateTemplateData,
  fetchDeliveryObjectOptions,

  fetchWebformFormFieldsData: fetchWebformFormFields,
}) => {
  return (
    <Col span={8}>
      <FormItem
        className='input-control form-control-item'
        name='integrationId'
        label={
          <Space
            style={{
              width: '100%',
              position: 'relative',
              columnGap: '0',
            }}>
            <Text>
              <Translate i18nKey='pages.templates.label.integrationName' />
            </Text>
            {deliveryType === DeliveryType.ZAPIER && (
              <PreviewLink
                integrationId={form.getFieldValue('integrationId')}
                style={{
                  position: 'absolute',
                  left: '23rem',
                  width: '100%',
                  top: '1px',
                }}
              />
            )}
          </Space>
        }
        rules={[{ required: true, message: REQUIRED_FIELD }]}>
        <Select
          placeholder='Select Integration Name'
          style={{ width: '100%' }}
          options={integrationOptions}
          onChange={(value) => {
            const isEditMode = Boolean(templateId);
            const existingIntegrationId = templateData?.integrationId;
            const isRestoringExistingIntegration =
              isEditMode && value === existingIntegrationId;
            const isUserChange = !isInitializing;

            // Get integration name from selected option
            const selectedOption = integrationOptions.find(
              (opt) => opt.value === value,
            );
            const integrationName = selectedOption?.label || '';

            // Preserve deliveryObject if we're restoring the same integration during initialization
            if (
              isRestoringExistingIntegration &&
              templateData?.deliveryObject &&
              !isUserChange
            ) {
              // Set form values including the delivery object ID
              form.setFieldsValue({
                integrationId: value,
                selectedDeliveryObjectId: templateData.deliveryObject.id,
                deliveryObject: templateData.deliveryObject,
              });

              updateTemplateData({
                integrationId: value,
                integrationName,
                deliveryObject: templateData.deliveryObject,
              });
            } else {
              // Clear form fields for user changes or when switching integrations
              form.setFieldsValue({
                integrationId: value,
                selectedDeliveryObjectId: undefined,
                deliveryObject: undefined,
              });

              if (isUserChange || !isRestoringExistingIntegration) {
                // Clear delivery object in context only for user changes or when actually switching integrations
                updateTemplateData({
                  integrationId: value,
                  integrationName,
                  deliveryObject: undefined,
                });
              }
            }

            if (!isRestoringExistingIntegration || isUserChange) {
              setDeliveryObjectOptions([]);
            }

            // Fetch form fields or delivery objects based on delivery type
            if (value) {
              if (deliveryType === DeliveryType.WEBFORM) {
                // For WebForm, directly fetch form fields
                fetchWebformFormFields(deliveryType, value, true);
              } else if (deliveryType === DeliveryType.ZAPIER) {
                // For Zapier, only fetch form fields if it's Interfaces type
                // Skip API calls for Zaps type (manual entry like Flat File)
                if (zapierType !== ZapierType.ZAPS) {
                  fetchWebformFormFields(deliveryType, value, true);
                }
              } else if (deliveryType === DeliveryType.HUBSPOT) {
                // For HubSpot only, fetch delivery objects
                fetchDeliveryObjectOptions(deliveryType, value, true);
              }
            }
          }}
          disabled={Boolean(templateId && !isEditTemplateAllowed)}
        />
      </FormItem>
    </Col>
  );
};
