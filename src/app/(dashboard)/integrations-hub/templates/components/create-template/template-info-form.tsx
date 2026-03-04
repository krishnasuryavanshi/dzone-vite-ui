import {
  REQUIRED_FIELD,
  TEMPLATE_DESCRIPTION_TRAILING_SPACES,
  TEMPLATE_NAME_LENGTH,
  TEMPLATE_NAME_TRAILING_SPACES,
} from '@/app/(dashboard)/campaign-management/lib/constants';
import { FieldSkeltonRow } from '@/app/(dashboard)/components';
import { Translate } from '@/components/i18n';
import { DzBox } from '@/components/layout/v1';
import { Hideable } from '@/components/shared';
import { DeliveryTemplateActionsEnum } from '@/lib/enums/permissions';
import { usePermissionCheck } from '@/lib/hooks';
import { Form, FormItem, useForm } from '@/uicomponents/form';
import { Input, Select } from '@/uicomponents/form/input';
import { InfoCircleOutlined } from '@/uicomponents/icons';
import { Col, Row } from '@/uicomponents/layout/grid';
import { Text } from '@/uicomponents/text';
import { Tooltip } from '@/uicomponents/tooltip';
import { debounce, pick } from 'lodash';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTemplateStore } from '../../stores/use-template-store';
import { DeliveryTypeOptions } from '../../lib/constants';
import { DeliveryType } from '../../lib/enums';
import { ITemplateResponse } from '../../lib/types';
import {
  fetchDeliveryObjects,
  fetchDestinationDropdownFields,
  fetchHubspotFormFields,
  fetchIntegrationLabels,
  fetchWebformFormFields,
} from '../../services';
import { useTemplateLineItemsQuery } from '../../hooks/use-template-line-items-query';
import { fetchZapierIntegrationLabels } from '../../services/fetch-zapier-integration-labels';
import { HubSpotDeliveryFields } from './hubspot-delivery-fields';
import { IntegrationNameField } from './integration-name-field';
import { ZapierTypeField } from './zapier-type-field';
import { DzRecord } from '@/lib/types';
import { PreviewLink } from './preview-link';
import { ScreenLoader } from '@/components/shared/loader';

interface ITemplateInfoFormProps {
  templateId?: string;
  userId?: string;
  isDzoneUser?: boolean;
  tenantCode: string | string[];
}

export const TemplateInfoForm: FC<ITemplateInfoFormProps> = ({
  templateId,
  userId,
  isDzoneUser,
  tenantCode,
}) => {
  const {
    templateData,
    updateTemplateData,
    updateErrorStatus,
    updateFormFieldMappingOptions,
    updateIntegrationsList,
    updateMasterFieldMappings,
    shouldReloadDependentData,
    setShouldReloadDependentData,
    deliveryType,
    setDeliveryType,
    zapierType,
    setZapierType,
  } = useTemplateStore();

  const [form] = useForm();
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
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [loadingDropdownFields, setLoadingDropdownFields] = useState(false);

  const isEditTemplateAllowed = usePermissionCheck(
    DeliveryTemplateActionsEnum.Edit,
  );

  const processedSessionTenantCode = Array.isArray(tenantCode)
    ? tenantCode.join(',')
    : tenantCode;

  // TanStack Query: Line Items for dropdown
  const { data: lineItemsData } = useTemplateLineItemsQuery();

  const lineItemOptions = useMemo(() => {
    const items = lineItemsData?.data ?? lineItemsData;
    if (!Array.isArray(items)) return [];
    return items.map((item: any) => ({
      label: item.name,
      value: item.id,
      customFields: item.customFields || [],
    }));
  }, [lineItemsData]);

  // Initial load: set form values and mapping from saved template fields
  useEffect(() => {
    if (templateData) {
      form.setFieldsValue({
        name: templateData.name,
        description: templateData.description,
        lineItemId: templateData.lineItemId,
        deliveryType: templateData.deliveryType,
        integrationId: templateData.integrationId,
        zapierType: templateData.type,
      });

      // Also set the deliveryType state to sync with form value
      if (templateData.deliveryType) {
        setDeliveryType(templateData.deliveryType);
      }

      // Set mapping from saved fields
      if (
        'fields' in templateData &&
        Array.isArray((templateData as any).fields)
      ) {
        updateMasterFieldMappings((templateData as any).fields);
      }
      // Fetch integration options for dropdown
      if (templateData.deliveryType) {
        fetchIntegrationOptions(templateData.deliveryType);
      }
      // DO NOT call destination dropdown API on initial edit load
    }
  }, [templateData]);

  // Handle reloading dependent data after cancel/reset
  useEffect(() => {
    if (shouldReloadDependentData && templateData) {
      // Reload integrations if HubSpot delivery type
      if (
        templateData.deliveryType === DeliveryType.HUBSPOT &&
        templateData.integrationId !== undefined &&
        templateData.integrationId !== null &&
        templateData.integrationId !== ''
      ) {
        fetchIntegrationOptions(templateData.deliveryType);
        fetchDeliveryObjectOptions(
          templateData.deliveryType,
          templateData.integrationId,
          false,
        );
      }

      if (
        (templateData.deliveryType === DeliveryType.WEBFORM ||
          templateData.deliveryType === DeliveryType.ZAPIER) &&
        templateData.integrationId !== undefined &&
        templateData.integrationId !== null &&
        templateData.integrationId !== ''
      ) {
        if (
          templateData.deliveryType === DeliveryType.ZAPIER &&
          templateData.type
        ) {
          // For Zapier, first fetch integration options with the type
          fetchZapierIntegrationLabels(
            templateData.deliveryType,
            templateData.type,
          ).then((response) => {
            if (response?.data) {
              const options = response.data.map(
                (integration: { id: string; name: string; url?: string }) => ({
                  label: integration.name,
                  value: integration.id,
                  url: integration.url || '',
                }),
              );
              setIntegrationOptions(options);
            }
          });
          // Only fetch form fields for Interfaces, not for Zaps (manual entry)
          if (templateData.type === 'Interfaces') {
            fetchWebformFormFieldsData(
              templateData.deliveryType,
              templateData.integrationId,
              false, // always false for initial/reload
              templateData.type, // Pass the type for Zapier
            );
          }
        } else if (templateData.deliveryType === DeliveryType.WEBFORM) {
          fetchIntegrationOptions(templateData.deliveryType);
          fetchWebformFormFieldsData(
            templateData.deliveryType,
            templateData.integrationId,
            false, // always false for initial/reload
            undefined,
          );
        }
      }

      // Reset the flag after handling
      setShouldReloadDependentData(false);
    }
  }, [shouldReloadDependentData, templateData]);
  // Fetch integration options when editing template with HubSpot delivery type
  useEffect(() => {
    if (
      templateData?.deliveryType === DeliveryType.HUBSPOT &&
      templateData?.integrationId
    ) {
      setIsInitializing(true);
      fetchIntegrationOptions(templateData.deliveryType);
    }
  }, [templateData?.deliveryType, templateData?.integrationId]);

  useEffect(() => {
    if (
      templateData?.deliveryType === DeliveryType.WEBFORM &&
      templateData?.integrationId
    ) {
      setIsInitializing(true);
      fetchIntegrationOptions(templateData.deliveryType);
      fetchWebformFormFieldsData(
        templateData.deliveryType,
        templateData.integrationId,
        false, // always false for initial/reload
        undefined, // No zapierTypeOverride for WebForm
      );
    }
  }, [templateData?.deliveryType, templateData?.integrationId]);

  // Handle Zapier initialization
  useEffect(() => {
    if (
      templateData?.deliveryType === DeliveryType.ZAPIER &&
      templateData?.integrationId &&
      templateData?.type
    ) {
      setIsInitializing(true);
      // Set zapier type from templateData
      setZapierType(templateData.type);
      form.setFieldsValue({ zapierType: templateData.type });

      // First fetch the integration options
      fetchZapierIntegrationLabels(
        templateData.deliveryType,
        templateData.type,
      ).then((response) => {
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
      });

      // Only fetch form fields for interfaces type, not for zaps (manual entry)
      if (templateData.type === 'Interfaces') {
        fetchWebformFormFieldsData(
          templateData.deliveryType,
          templateData.integrationId,
          false,
          templateData.type, // Pass the type as zapierTypeOverride
        );
      }
    }
  }, [
    templateData?.deliveryType,
    templateData?.integrationId,
    templateData?.type,
  ]);

  // Fetch delivery objects when editing template with both deliveryType and integrationId
  useEffect(() => {
    if (
      templateData?.deliveryType === DeliveryType.HUBSPOT &&
      templateData?.integrationId &&
      integrationOptions.length > 0
    ) {
      fetchDeliveryObjectOptions(
        templateData.deliveryType,
        templateData.integrationId,
        false,
      );
    }
  }, [
    templateData?.deliveryType,
    templateData?.integrationId,
    integrationOptions,
  ]);

  // Update form values after integration options are loaded for editing
  useEffect(() => {
    if (
      templateData?.integrationId &&
      integrationOptions.length > 0 &&
      templateId
    ) {
      const existingIntegration = integrationOptions.find(
        (option) => option.value === templateData.integrationId,
      );
      if (existingIntegration) {
        form.setFieldsValue({
          integrationId: templateData.integrationId,
        });
      }
    }
  }, [integrationOptions, templateData?.integrationId, templateId]);

  // Update form values after delivery object options are loaded for editing
  useEffect(() => {
    if (
      templateData?.deliveryObject?.id &&
      deliveryObjectOptions.length > 0 &&
      templateId
    ) {
      const existingDeliveryObject = deliveryObjectOptions.find(
        (option) => option.id === templateData.deliveryObject?.id,
      );
      if (existingDeliveryObject) {
        form.setFieldsValue({
          selectedDeliveryObjectId: templateData.deliveryObject.id,
        });
      }
      // Clear initializing flag after delivery object options are set
      setIsInitializing(false);
    }
  }, [deliveryObjectOptions, templateData?.deliveryObject?.id, templateId]);

  useEffect(() => {
    const selectedDeliveryObjectId = form.getFieldValue(
      'selectedDeliveryObjectId',
    );
    if (selectedDeliveryObjectId && deliveryObjectOptions.length > 0) {
      const selectedObject = deliveryObjectOptions.find(
        (opt) => opt.value === selectedDeliveryObjectId,
      );

      if (selectedObject) {
        const deliveryObjectData = {
          id: selectedObject.id,
          name: selectedObject.name,
        };

        updateTemplateData({
          deliveryObject: deliveryObjectData,
        });

        if (deliveryType && form.getFieldValue('integrationId')) {
          // Pass true for shouldUpdateMappings when user changes selection
          fetchHubspotFormFieldsData(
            deliveryType,
            form.getFieldValue('integrationId'),
            selectedDeliveryObjectId,
            false,
          );
        }
      }
    }
  }, [deliveryObjectOptions, deliveryType]);

  const processFormValues = (values: any) => {
    let processedValues = { ...values };

    // Handle deliveryObject transformation based on delivery type
    if (values.deliveryType === DeliveryType.HUBSPOT) {
      if (values.selectedDeliveryObjectId) {
        // First try to find the selected object in options
        const selectedObject = deliveryObjectOptions.find(
          (opt) =>
            opt.value === values.selectedDeliveryObjectId ||
            opt.id === values.selectedDeliveryObjectId,
        );

        if (selectedObject) {
          processedValues.deliveryObject = {
            id: selectedObject.id,
            name: selectedObject.name,
          };
        } else if (
          templateData?.deliveryObject?.id === values.selectedDeliveryObjectId
        ) {
          // Use existing template data if IDs match
          processedValues.deliveryObject = templateData?.deliveryObject;
        } else if (templateData?.deliveryObject) {
          // Fallback to existing deliveryObject if it exists
          processedValues.deliveryObject = templateData.deliveryObject;
        }
      } else if (templateData?.deliveryObject) {
        // Always preserve existing deliveryObject if no selection is made
        processedValues.deliveryObject = templateData.deliveryObject;
      }
    } else if (values.deliveryType === DeliveryType.FLAT_FILE) {
      // For FlatFile, ensure deliveryObject is undefined
      processedValues.deliveryObject = undefined;
      processedValues.integrationId = undefined;
    } else if (values.deliveryType === DeliveryType.ZAPIER) {
      // For Zapier, include the type (zaps/interfaces)
      if (values.zapierType) {
        processedValues.type = values.zapierType;
      }
    }

    // Remove unwanted form fields from the processed values
    const { selectedDeliveryObjectId, zapierType, ...cleanedValues } =
      processedValues;
    processedValues = cleanedValues;

    return processedValues;
  };

  const submitForm = async () => {
    // Skip form processing during initialization to prevent clearing deliveryObject
    if (isInitializing) {
      return;
    }

    try {
      const values = await form.validateFields();
      const processedValues = processFormValues(values);

      updateStateInContext(processedValues, false);
    } catch (error) {
      const values = await form.getFieldsValue();
      const processedValues = processFormValues(values);

      updateStateInContext(processedValues, true);
    }
  };

  const updateStateInContext = (
    values: Partial<ITemplateResponse>,
    infoError: boolean,
  ) => {
    const pickedValues = pick(values, [
      'name',
      'description',
      'lineItemId',
      'deliveryType',
      'integrationId',
      'integrationName',
      'deliveryObject',
      'label',
      'type', // Include type field for Zapier (Zaps/Interfaces)
    ]);

    // Only update deliveryObject if it's explicitly defined in values
    // This prevents clearing existing deliveryObject when it's not in form values
    if (values.deliveryObject === undefined && templateData?.deliveryObject) {
      pickedValues.deliveryObject = templateData.deliveryObject;
    }

    updateTemplateData(pickedValues);
    updateErrorStatus({ infoError });
  };

  const debouncedSubmitForm = debounce(submitForm, 500);

  const fetchIntegrationOptions = async (value: string) => {
    try {
      const response = await fetchIntegrationLabels(value);
      if (response?.data) {
        // Store the raw integrations data in context for later use
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

  const fetchDeliveryObjectOptions = async (
    type: string,
    integrationId: string,
    _shouldUpdateMappings?: boolean, // Accept third argument for compatibility
  ) => {
    try {
      const response = await fetchDeliveryObjects(type, integrationId);
      if (response?.data?.forms) {
        const options = response.data.forms.map(
          (object: { id: string; name: string; fieldCount: any }) => ({
            label: object.name, // Simple label for display when selected
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

  const fetchHubspotFormFieldsData = async (
    type: string,
    integrationId: string,
    formId: string,
    shouldUpdateMappings: boolean,
  ) => {
    setLoadingDropdownFields(true);
    try {
      const lineItemId =
        form.getFieldValue('lineItemId') || templateData?.lineItemId;
      const [fieldMappingData, dropdownFieldsData] = await Promise.all([
        fetchHubspotFormFields(type, integrationId, formId, lineItemId),
        fetchDestinationDropdownFields(type, integrationId, formId, lineItemId),
      ]);

      if (dropdownFieldsData?.data && Array.isArray(dropdownFieldsData.data)) {
        createDestinationDropdownOptions(dropdownFieldsData.data);
      }
      if (
        shouldUpdateMappings &&
        fieldMappingData?.data &&
        Array.isArray(fieldMappingData.data)
      ) {
        mapDestinationFields(fieldMappingData.data);
      }
    } catch (error) {
      // Error fetching form fields
      updateFormFieldMappingOptions([]);
    } finally {
      setLoadingDropdownFields(false);
    }
  };

  const fetchWebformFormFieldsData = async (
    type: string,
    integrationId: string,
    shouldUpdateMappings: boolean,
    zapierTypeOverride?: string, // Optional parameter for Zapier type
  ) => {
    // For Zapier with type "Zaps", skip API calls - user will enter fields manually
    const actualZapierType =
      type === DeliveryType.ZAPIER
        ? zapierTypeOverride || zapierType || 'Zaps'
        : null;

    if (type === DeliveryType.ZAPIER && actualZapierType === 'Zaps') {
      // Skip API calls for Zaps - manual entry like Flat File
      updateFormFieldMappingOptions([]);
      updateMasterFieldMappings([]);
      return;
    }

    setLoadingDropdownFields(true);
    try {
      const lineItemId =
        form.getFieldValue('lineItemId') || templateData?.lineItemId;
      const [fieldMappingData, dropdownFieldsData] = await Promise.all([
        fetchWebformFormFields(type, integrationId, lineItemId),
        fetchDestinationDropdownFields(
          type,
          integrationId,
          undefined,
          lineItemId,
        ),
      ]);
      if (dropdownFieldsData?.data && Array.isArray(dropdownFieldsData.data)) {
        createDestinationDropdownOptions(dropdownFieldsData.data);
      }
      // // Only update field mappings if not initial edit load (i.e., for create or user-triggered changes)
      if (
        shouldUpdateMappings &&
        fieldMappingData?.data &&
        Array.isArray(fieldMappingData.data)
      ) {
        mapDestinationFields(fieldMappingData.data);
      }
    } catch (error) {
      // Error fetching form fields
      updateFormFieldMappingOptions([]);
    } finally {
      setLoadingDropdownFields(false);
    }
  };

  const createDestinationDropdownOptions = (dropDownOptions: DzRecord[]) => {
    const mappingOptions = Array.from(dropDownOptions).map(
      ({ name: label, value }) => ({
        label,
        value,
      }),
    );

    // Add a "None" option for unmapped fields
    mappingOptions.unshift({ label: 'None', value: '' });

    // Update the context with mapping options
    updateFormFieldMappingOptions(mappingOptions);
  };

  const mapDestinationFields = (fieldAiMappingData: DzRecord[]) => {
    const masterMappings = fieldAiMappingData.map((field: any) => ({
      id: field.id,
      masterName: field.masterName,
      masterValue: field.masterValue,
      mappingName: field.mappingName,
      mappingValue: field.mappingValue,
      order: field.order,
      visible: field.visible,
    }));

    // This will automatically sync the template fields with master mappings
    updateMasterFieldMappings(masterMappings);
  };

  const handleZapierTypeChange = async (type: string) => {
    setZapierType(type);
    form.setFieldsValue({
      integrationId: undefined,
      selectedDeliveryObjectId: undefined,
      deliveryObject: undefined,
    });
    setIntegrationOptions([]);

    // Fetch Zapier integrations based on selected type
    try {
      const response = await fetchZapierIntegrationLabels(deliveryType, type);
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
    debouncedSubmitForm();
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
    });
    setIntegrationOptions([]);
    setDeliveryObjectOptions([]);
    updateFormFieldMappingOptions([]);
    updateMasterFieldMappings([]);

    if (value === DeliveryType.HUBSPOT || value === DeliveryType.WEBFORM) {
      fetchIntegrationOptions(value);
      // Do NOT call fetchWebformFormFieldsData here!
      // Wait for integrationId to be set by user selection before calling it.
    } else if (value === DeliveryType.ZAPIER) {
      // For Zapier, we need to wait for type selection
      // Don't set zapierType to empty string, keep it undefined for placeholder
      form.setFieldsValue({ zapierType: undefined });
    }
    debouncedSubmitForm();
  };

  if (loadingDropdownFields) return <ScreenLoader />;

  return (
    <>
      <Form form={form} layout='vertical' onValuesChange={debouncedSubmitForm}>
        {/* Template Detail Section */}
        <DzBox
          className='dz-page-content'
          dzOneBox
          style={{ marginBottom: '0.5rem' }}>
          <Text
            style={{
              fontSize: '16px',
              fontWeight: '600',
            }}>
            Template Detail
          </Text>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <FormItem
                className='input-control form-control-item'
                name='name'
                label={
                  <Translate i18nKey='pages.templates.label.templateName' />
                }
                rules={[
                  { type: 'string' },
                  { required: true, message: REQUIRED_FIELD },
                  {
                    pattern: /^\S.*\S$|^\S$/,
                    message: TEMPLATE_NAME_TRAILING_SPACES,
                  },
                  {
                    min: 3,
                    message: TEMPLATE_NAME_LENGTH,
                  },
                ]}>
                <Input
                  className='input-field'
                  placeholder='Enter Template Name'
                  disabled={Boolean(templateId && !isEditTemplateAllowed)}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                className='input-control form-control-item'
                name='description'
                label={
                  <Translate i18nKey='pages.templates.label.templateDescription' />
                }
                rules={[
                  { type: 'string' },
                  {
                    pattern: /^\S.*\S$|^\S$/,
                    message: TEMPLATE_DESCRIPTION_TRAILING_SPACES,
                  },
                ]}>
                <Input
                  className='input-field'
                  placeholder='Enter Template Description'
                  disabled={Boolean(templateId && !isEditTemplateAllowed)}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                className='input-control form-control-item'
                name='lineItemId'
                label={
                  <Text>
                    <Translate i18nKey='pages.templates.label.lineItem' />{' '}
                  </Text>
                }
                rules={[
                  {
                    required: true,
                    message: 'Line Item selection is required',
                  },
                ]}>
                <Select
                  className='input-field'
                  placeholder='Select Line Item Name'
                  options={lineItemOptions}
                  disabled={Boolean(templateId)}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '')
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  onChange={(value) => {
                    // Handle Line Item selection change
                    const selectedLineItem = lineItemOptions.find(
                      (opt) => opt.value === value,
                    );
                    if (selectedLineItem) {
                      // Use updateTemplateData but ensure form doesn't reset by preserving current form values
                      const currentFormValues = form.getFieldsValue();

                      updateTemplateData({
                        lineItemId: value,
                        lineItemName: selectedLineItem.label,
                        customFields: selectedLineItem.customFields || [],
                      });

                      // Immediately restore form values to prevent reset
                      setTimeout(() => {
                        form.setFieldsValue(currentFormValues);
                      }, 0);

                      // If deliveryType and integrationId are already selected, re-fetch mapping
                      const deliveryTypeValue =
                        form.getFieldValue('deliveryType');
                      const integrationIdValue =
                        form.getFieldValue('integrationId');
                      if (deliveryTypeValue && integrationIdValue) {
                        if (deliveryTypeValue === DeliveryType.WEBFORM) {
                          fetchWebformFormFieldsData(
                            deliveryTypeValue,
                            integrationIdValue,
                            true,
                          );
                        } else if (deliveryTypeValue === DeliveryType.HUBSPOT) {
                          // For HubSpot, need deliveryObjectId if available
                          const selectedDeliveryObjectId = form.getFieldValue(
                            'selectedDeliveryObjectId',
                          );
                          fetchHubspotFormFieldsData(
                            deliveryTypeValue,
                            integrationIdValue,
                            selectedDeliveryObjectId,
                            true,
                          );
                        }
                      }
                    }
                    debouncedSubmitForm();
                  }}
                />
              </FormItem>
            </Col>
          </Row>
        </DzBox>

        {/* Delivery Detail Section */}
        <DzBox
          className='dz-page-content'
          dzOneBox
          style={{ marginBottom: '1rem' }}>
          <Text
            style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '16px',
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

            <Hideable show={deliveryType === DeliveryType.ZAPIER}>
              <ZapierTypeField
                templateId={templateId}
                isEditTemplateAllowed={isEditTemplateAllowed}
                onTypeChange={handleZapierTypeChange}
                zapierType={zapierType}
              />
            </Hideable>

            <Hideable
              show={
                deliveryType === DeliveryType.HUBSPOT ||
                deliveryType === DeliveryType.WEBFORM ||
                deliveryType === DeliveryType.ZAPIER
              }>
              <IntegrationNameField
                form={form}
                templateId={templateId}
                templateData={templateData}
                isEditTemplateAllowed={isEditTemplateAllowed}
                isInitializing={isInitializing}
                integrationOptions={integrationOptions}
                deliveryType={deliveryType}
                setDeliveryObjectOptions={setDeliveryObjectOptions}
                updateTemplateData={updateTemplateData}
                fetchDeliveryObjectOptions={fetchDeliveryObjectOptions}
                fetchWebformFormFieldsData={(type, integrationId) => {
                  // Use form values if templateData is not available (creation mode)
                  const deliveryTypeValue =
                    type || form.getFieldValue('deliveryType');
                  const integrationIdValue =
                    integrationId || form.getFieldValue('integrationId');
                  if (
                    (deliveryTypeValue === DeliveryType.WEBFORM ||
                      deliveryTypeValue === DeliveryType.ZAPIER) &&
                    integrationIdValue
                  ) {
                    // Pass zapierType for Zapier integrations
                    const zapierTypeValue =
                      deliveryTypeValue === DeliveryType.ZAPIER
                        ? zapierType ||
                          form.getFieldValue('zapierType') ||
                          'Zaps'
                        : undefined;
                    fetchWebformFormFieldsData(
                      deliveryTypeValue,
                      integrationIdValue,
                      true,
                      zapierTypeValue,
                    );
                  }
                }}
              />
              <Hideable show={deliveryType === DeliveryType.WEBFORM}>
                <PreviewLink
                  integrationId={form.getFieldValue('integrationId')}
                  style={{ marginTop: '3rem' }}
                />
              </Hideable>
            </Hideable>
            <Hideable show={deliveryType === DeliveryType.HUBSPOT}>
              <HubSpotDeliveryFields
                form={form}
                templateId={templateId}
                isEditTemplateAllowed={isEditTemplateAllowed}
                deliveryObjectOptions={deliveryObjectOptions}
                deliveryType={deliveryType}
                updateTemplateData={updateTemplateData}
                // On initial load (edit scenario), pass false for shouldUpdateMappings
                fetchFormFieldsData={(
                  type,
                  integrationId,
                  formId,
                  isInitialLoad = false,
                ) => {
                  fetchHubspotFormFieldsData(
                    type,
                    integrationId,
                    formId,
                    isInitialLoad ? false : true,
                  );
                }}
              />
            </Hideable>
          </Row>
        </DzBox>
      </Form>
      {/* PreviewLink now handles its own modal internally */}
    </>
  );
};
