'use client';

import { showNotification } from '@/services/notification';
import { Button } from '@/uicomponents';
import { FormInstance } from '@/uicomponents/form';
import { LoadingOutlined } from '@/uicomponents/icons';
import { Flex, Space } from '@/uicomponents/layout';
import { FC } from 'react';
import { TemplateStep } from '../../../../lib/enums';
import { triggerAiMapping } from '../../../../services';
import { useTemplateStore } from '../../../../stores';

interface Step1FooterProps {
  form: FormInstance;
}

export const Step1Footer: FC<Step1FooterProps> = ({ form }) => {
  const {
    setCurrentStep,
    setAiMappingLoading,
    isAiMappingLoading,
    updateMasterFieldMappings,
    updateFormFieldMappingOptions,
    updateTemplateData,
  } = useTemplateStore();

  const handleStartAiMapping = async () => {
    try {
      // Validate form first
      const values = await form.validateFields();

      // Check required fields
      if (!values.lineItemId) {
        showNotification({
          type: 'error',
          message: 'Please select a Line Item',
        });
        return;
      }

      if (!values.name) {
        showNotification({
          type: 'error',
          message: 'Please enter a Template Name',
        });
        return;
      }

      if (!values.deliveryType) {
        showNotification({
          type: 'error',
          message: 'Please select a Delivery Type',
        });
        return;
      }

      // For HubSpot, require integration and delivery object
      if (values.deliveryType === 'HubSpot') {
        if (!values.integrationId) {
          showNotification({
            type: 'error',
            message: 'Please select an Integration Name',
          });
          return;
        }
        if (!values.selectedDeliveryObjectId) {
          showNotification({
            type: 'error',
            message: 'Please select a Delivery Object',
          });
          return;
        }
      }

      // For WebForm, require integration
      if (values.deliveryType === 'WebForm' && !values.integrationId) {
        showNotification({
          type: 'error',
          message: 'Please select an Integration Name',
        });
        return;
      }

      // For FTP, require integration
      if (values.deliveryType === 'FTP' && !values.integrationId) {
        showNotification({
          type: 'error',
          message: 'Please select an FTP Integration Name',
        });
        return;
      }

      // For Zapier, require source type and integration
      if (values.deliveryType === 'Zapier') {
        if (!values.zapierType) {
          showNotification({
            type: 'error',
            message: 'Please select a Source Type',
          });
          return;
        }
        if (!values.integrationId) {
          showNotification({
            type: 'error',
            message: 'Please select an Integration Name',
          });
          return;
        }
      }

      setAiMappingLoading(true);

      // Update template data with form values
      updateTemplateData({
        name: values.name,
        description: values.description,
        lineItemId: values.lineItemId,
        deliveryType: values.deliveryType,
        integrationId: values.integrationId,
        type: values.zapierType, // Source type for Zapier (Zaps/Interfaces)
      });

      // Trigger AI mapping
      const result = await triggerAiMapping({
        lineItemId: values.lineItemId,
        deliveryType: values.deliveryType,
        integrationId: values.integrationId,
        deliveryObjectId: values.selectedDeliveryObjectId,
        zapierType: values.zapierType, // Pass zapierType for handling Zaps
      });

      // Update store with mapping results
      updateMasterFieldMappings(result.masterFieldMappings);
      updateFormFieldMappingOptions(result.formFieldMappingOptions);

      // Transition to Step 2
      setCurrentStep(TemplateStep.FieldMapping);
    } catch (error: any) {
      if (error?.errorFields) {
        // Form validation error - already shown by Ant Design
        return;
      }
      showNotification({
        type: 'error',
        message: error?.message || 'Failed to start AI mapping',
      });
    } finally {
      setAiMappingLoading(false);
    }
  };

  const gradientButtonStyle = {
    background: 'linear-gradient(80deg, #235AED -8.29%, #C72F9C 131.45%)',
    border: 'none',
    borderRadius: '4px',
    padding: '0.75rem',
    height: 'auto',
    minWidth: '10rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#fff',
  };

  return (
    <Flex justify='flex-end' style={{ marginTop: '2rem', padding: '0 1rem' }}>
      <Space size='middle'>
        <Button
          type='primary'
          style={gradientButtonStyle}
          onClick={handleStartAiMapping}
          disabled={isAiMappingLoading}>
          {isAiMappingLoading ? (
            <Space>
              <LoadingOutlined />
              <span>Processing...</span>
            </Space>
          ) : (
            'Start AI Mapping'
          )}
        </Button>
      </Space>
    </Flex>
  );
};
