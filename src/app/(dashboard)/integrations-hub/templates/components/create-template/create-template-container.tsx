
import { Flex } from '@/uicomponents/layout';
import { Spin } from '@/uicomponents/spin';
import { FC, useEffect } from 'react';
import { DeliveryType, TemplateStep } from '../../lib/enums';
import { useTemplateStore } from '../../stores';
import { Step1Container } from './steps/step1-configuration';
import { Step2Container } from './steps/step2-field-mapping';
import {
  useReservedNamesQuery,
  useTemplateDetailQuery,
  useDestinationFieldsQuery,
} from '../../hooks';

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

  // Fetch reserved names
  const { data: reservedNamesData } = useReservedNamesQuery(true);

  useEffect(() => {
    if (reservedNamesData?.data) {
      updateReservedNames(
        reservedNamesData.data.map(({ name }: { name: string }) => name),
      );
    }
  }, [reservedNamesData]);

  // Fetch template details for edit mode
  const { data: templateDetailData } = useTemplateDetailQuery(
    templateId ?? '',
    !!templateId && existingTemplate,
  );

  useEffect(() => {
    if (templateDetailData?.data) {
      setInitialTemplateData(templateDetailData.data, true);
    }
  }, [templateDetailData]);

  // Determine if destination fields should be fetched
  const shouldFetchDestinationFields =
    existingTemplate &&
    !!updatedTemplateData?.deliveryType &&
    updatedTemplateData.deliveryType !== DeliveryType.FLAT_FILE &&
    updatedTemplateData.deliveryType !== DeliveryType.FTP &&
    !!updatedTemplateData.integrationId;

  const { data: destinationFieldsData, isLoading: isLoadingDropdownOptions } =
    useDestinationFieldsQuery(
      (updatedTemplateData?.deliveryType as string) ?? '',
      (updatedTemplateData?.integrationId as string) ?? '',
      updatedTemplateData?.deliveryObject?.id,
      updatedTemplateData?.type as string | undefined,
      shouldFetchDestinationFields,
    );

  // Sync dropdown options and confidence values from destination fields query
  useEffect(() => {
    if (!destinationFieldsData) return;

    const { dropdownOptions, formFieldsData } = destinationFieldsData;

    if (dropdownOptions) {
      updateFormFieldMappingOptions(dropdownOptions);
    }

    if (formFieldsData) {
      const confidenceMap = new Map<string, number>();
      formFieldsData.forEach((field) => {
        if (field.masterName && field.confidence !== undefined) {
          confidenceMap.set(field.masterName, field.confidence);
        }
      });

      fields.forEach((field, index) => {
        const confidence = confidenceMap.get(field.source || field.name);
        if (confidence !== undefined) {
          updateFieldByIndex(index, { ...field, confidence }, true);
        }
      });
    }
  }, [destinationFieldsData]);

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
