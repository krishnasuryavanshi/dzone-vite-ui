import { IMasterFieldMapping } from '../types/field-mapping';

export const getFieldMappingOptions = (
  fieldValue: string,
  masterFieldMappings: IMasterFieldMapping[] = [],
) => {
  // Find the master field mapping that matches the current field's fieldValue
  const matchingMasterField = masterFieldMappings.find(
    (mapping) => mapping.masterValue === fieldValue,
  );

  // If no matching field or the matching field has null mappingName/mappingValue, return empty
  if (
    !matchingMasterField ||
    !matchingMasterField.mappingName ||
    !matchingMasterField.mappingValue
  ) {
    return [];
  }

  // Filter mappings that have both mappingName and mappingValue (not null)
  // and are visible according to the master data
  const validMappings = masterFieldMappings
    .filter((mapping) => mapping.mappingName && mapping.mappingValue && mapping.visible)
    .sort((a, b) => a.order - b.order); // Sort by order

  // Return options with mappingName as label and mappingValue as value
  return validMappings.map((mapping) => ({
    label: mapping.mappingName as string,
    value: mapping.mappingValue as string,
  }));
};
