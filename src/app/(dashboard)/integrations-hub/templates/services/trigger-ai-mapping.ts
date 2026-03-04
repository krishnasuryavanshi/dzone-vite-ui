import { DzRecord } from '@/lib/types';
import { IMasterFieldMapping } from '../lib/types';
import { fetchCreateTemplateData } from './fetch-create-template-data';
import { fetchDestinationDropdownFields } from './fetch-destination-dropdown-fields';
import { fetchHubspotFormFields } from './fetch-hubspot-form-fields';
import { fetchWebformFormFields } from './fetch-webform-form-fields';
import { DeliveryType } from '../lib/enums';
import { ZapierType } from '../../integrations/lib/constants/zapier-types';

export interface TriggerAiMappingParams {
  lineItemId: string;
  deliveryType: string;
  integrationId?: string;
  deliveryObjectId?: string;
  zapierType?: string;
}

export interface TriggerAiMappingResult {
  masterFieldMappings: IMasterFieldMapping[];
  formFieldMappingOptions: { label: string; value: string }[];
}

export const triggerAiMapping = async (
  params: TriggerAiMappingParams,
): Promise<TriggerAiMappingResult> => {
  const { lineItemId, deliveryType, integrationId, deliveryObjectId, zapierType } = params;

  // First, fetch source fields from the line item
  const sourceFieldsResponse = await fetchCreateTemplateData(lineItemId);

  if (!sourceFieldsResponse?.data?.fields) {
    throw new Error('Failed to fetch source fields');
  }

  // Sort and filter visible source fields
  const visibleSourceFields = sourceFieldsResponse.data.fields
    .filter((field: DzRecord) => field.visible)
    .sort((a: DzRecord, b: DzRecord) => a.order - b.order);

  // For FlatFile, FTP, and Zapier Zaps, return source fields with destination same as source name
  const isManualEntry =
    deliveryType === DeliveryType.FLAT_FILE ||
    deliveryType === DeliveryType.FTP ||
    (deliveryType === DeliveryType.ZAPIER && zapierType === ZapierType.ZAPS);

  if (isManualEntry) {
    const masterMappings: IMasterFieldMapping[] = visibleSourceFields.map((field: DzRecord) => ({
      id: field.id,
      masterName: field.name,
      masterValue: field.fieldValue,
      mappingName: field.name,
      mappingValue: field.name,
      order: field.order,
      visible: field.visible,
      isStandardField: field.isStandardField,
    }));

    return {
      masterFieldMappings: masterMappings,
      formFieldMappingOptions: [],
    };
  }

  // For HubSpot and WebForm, fetch AI mappings and dropdown options
  if (!integrationId) {
    throw new Error('Integration ID is required for HubSpot/WebForm');
  }

  let fieldMappingData: DzRecord | null = null;
  let dropdownFieldsData: DzRecord | null = null;

  if (deliveryType === 'HubSpot') {
    if (!deliveryObjectId) {
      throw new Error('Delivery Object ID is required for HubSpot');
    }

    [fieldMappingData, dropdownFieldsData] = await Promise.all([
      fetchHubspotFormFields(deliveryType, integrationId, deliveryObjectId, lineItemId),
      fetchDestinationDropdownFields(deliveryType, integrationId, deliveryObjectId, lineItemId),
    ]);
  } else if (deliveryType === 'WebForm' || deliveryType === 'Zapier') {
    [fieldMappingData, dropdownFieldsData] = await Promise.all([
      fetchWebformFormFields(deliveryType, integrationId, lineItemId),
      fetchDestinationDropdownFields(deliveryType, integrationId, undefined, lineItemId),
    ]);
  }

  // Process dropdown options
  let formFieldMappingOptions: { label: string; value: string }[] = [];
  if (dropdownFieldsData?.data && Array.isArray(dropdownFieldsData.data)) {
    formFieldMappingOptions = dropdownFieldsData.data.map(
      ({ name: label, value }: { name: string; value: string }) => ({
        label,
        value,
      }),
    );
    // Add "None" option for unmapped fields
    formFieldMappingOptions.unshift({ label: 'None', value: '' });
  }

  // Process AI field mappings
  let masterMappings: IMasterFieldMapping[] = [];
  if (fieldMappingData?.data && Array.isArray(fieldMappingData.data)) {
    masterMappings = fieldMappingData.data.map((field: DzRecord) => ({
      id: field.id,
      masterName: field.masterName,
      masterValue: field.masterValue,
      mappingName: field.mappingName,
      mappingValue: field.mappingValue,
      order: field.order,
      visible: field.visible,
      confidence: field.confidence,
      isStandardField: field.isStandardField,
    }));
  } else {
    // Fallback: use source fields with empty destinations
    masterMappings = visibleSourceFields.map((field: DzRecord) => ({
      id: field.id,
      masterName: field.name,
      masterValue: field.fieldValue,
      mappingName: null,
      mappingValue: null,
      order: field.order,
      visible: field.visible,
      confidence: 0,
      isStandardField: field.isStandardField,
    }));
  }

  return {
    masterFieldMappings: masterMappings,
    formFieldMappingOptions,
  };
};
