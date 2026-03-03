
import { DzRecord } from '@/lib/types';
import { Flex } from '@/uicomponents/layout';
import { Spin } from '@/uicomponents/spin';
import { FC, useEffect, useState } from 'react';
import { DeliveryType, TemplateStep } from '../../lib/enums';
import {
  fetchDestinationDropdownFields,
  fetchHubspotFormFields,
  fetchReservedDestinationNames,
  fetchTemplateDetails,
  fetchWebformFormFields,
} from '../../services';
import { useTemplateStore } from '../../stores';
import { Step1Container } from './steps/step1-configuration';
import { Step2Container } from './steps/step2-field-mapping';

interface ICreateTemplateContainerProps {
  templateId?: string;
  existingTemplate?: boolean;
  userId?: string;
  isDzoneUser?: boolean;
  tenantCode: string | string[];
}

export const CreateTemplateContainer: FC<ICreateTemplateContainerProps> = ({
  templateId,
  existingTemplate = false,
}) => {
  const {
    currentStep,
    setInitialTemplateData,
    updateReservedNames,
    updatedTemplateData,
    updateFormFieldMappingOptions,
    updateFieldByIndex,
    fields,
  } = useTemplateStore();

  const [isLoadingDropdownOptions, setIsLoadingDropdownOptions] =
    useState(false);

  useEffect(() => {
    fetchReservedDestinationNameList();
  }, []);

  useEffect(() => {
    if (templateId && existingTemplate) {
      fetchTemplateData(templateId);
    }
  }, [templateId, existingTemplate]);

  // Fetch destination dropdown options and form fields for edit mode (HubSpot, WebForm, Zapier)
  useEffect(() => {
    if (
      existingTemplate &&
      updatedTemplateData?.deliveryType &&
      updatedTemplateData.deliveryType !== DeliveryType.FLAT_FILE &&
      updatedTemplateData.deliveryType !== DeliveryType.FTP &&
      updatedTemplateData.integrationId
    ) {
      const fetchDropdownAndFormFields = async () => {
        setIsLoadingDropdownOptions(true);
        try {
          const deliveryType = updatedTemplateData.deliveryType as string;
          const integrationId = updatedTemplateData.integrationId as string;
          const deliveryObjectId = updatedTemplateData.deliveryObject?.id;

          // Fetch dropdown options (skip for Zapier "Zaps" type)
          // Zaps type uses manual field entry like Flat File
          if (
            !(deliveryType === 'Zapier' && updatedTemplateData.type === 'Zaps')
          ) {
            const dropdownResponse = await fetchDestinationDropdownFields(
              deliveryType,
              integrationId,
              deliveryObjectId,
            );

            if (dropdownResponse?.data) {
              const options = dropdownResponse.data.map(
                (field: { value: string; name: string }) => ({
                  label: field.name,
                  value: field.value,
                }),
              );
              updateFormFieldMappingOptions(options);
            }
          }

          // Fetch form fields to get confidence values
          let formFieldsResponse: DzRecord | null = null;

          if (deliveryType === 'HubSpot' && deliveryObjectId) {
            formFieldsResponse = await fetchHubspotFormFields(
              deliveryType,
              integrationId,
              deliveryObjectId,
            );
          } else if (deliveryType === 'WebForm') {
            formFieldsResponse = await fetchWebformFormFields(
              deliveryType,
              integrationId,
            );
          } else if (deliveryType === 'Zapier') {
            // For Zapier, only fetch form fields if it's NOT Zaps type
            // Zaps type uses manual field entry like Flat File
            if (
              updatedTemplateData.type &&
              updatedTemplateData.type !== 'Zaps'
            ) {
              formFieldsResponse = await fetchWebformFormFields(
                deliveryType,
                integrationId,
              );
            }
          }

          // Update fields with confidence values from form fields API
          if (
            formFieldsResponse?.data &&
            Array.isArray(formFieldsResponse.data)
          ) {
            const confidenceMap = new Map<string, number>();
            formFieldsResponse.data.forEach((field: DzRecord) => {
              if (field.masterName && field.confidence !== undefined) {
                confidenceMap.set(field.masterName, field.confidence);
              }
            });

            // Update each field's confidence value
            fields.forEach((field, index) => {
              const confidence = confidenceMap.get(field.source || field.name);
              if (confidence !== undefined) {
                updateFieldByIndex(index, { ...field, confidence }, true);
              }
            });
          }
        } catch (error) {
          // Error fetching dropdown options or form fields
        } finally {
          setIsLoadingDropdownOptions(false);
        }
      };

      fetchDropdownAndFormFields();
    }
  }, [
    existingTemplate,
    updatedTemplateData?.deliveryType,
    updatedTemplateData?.integrationId,
  ]);

  const fetchTemplateData = async (templateId: string) => {
    try {
      const { data } = await fetchTemplateDetails(templateId);
      setInitialTemplateData(data, true);
    } catch (error) {}
  };

  const fetchReservedDestinationNameList = async () => {
    try {
      const { data } = await fetchReservedDestinationNames();
      updateReservedNames(data.map(({ name }: { name: string }) => name));
    } catch (error) {
      // Error handling
    }
  };

  // For existing templates (edit mode), always show Step 2
  // For new templates, show based on current step
  const shouldShowStep2 =
    existingTemplate || currentStep === TemplateStep.FieldMapping;

  // Show full page loader while fetching dropdown options in edit mode
  if (isLoadingDropdownOptions) {
    return (
      <Flex
        align='center'
        justify='center'
        style={{ height: '100%', width: '100%' }}>
        <Spin size='large' />
      </Flex>
    );
  }

  return (
    <Flex vertical style={{ height: '100%' }}>
      {shouldShowStep2 ? (
        <Step2Container templateId={templateId} />
      ) : (
        <Step1Container templateId={templateId} />
      )}
    </Flex>
  );
};
