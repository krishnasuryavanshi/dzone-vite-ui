import { cloneDeep, pick } from 'lodash';
import { createContext, ReactNode, useEffect, useState, useMemo } from 'react';
import {
  ICreateTemplateContext,
  ITemplateFieldMapping,
  ITemplateFieldRequest,
  ITemplateFieldResponse,
  ITemplateInfo,
  ITemplateRequest,
  ITemplateResponse,
  IMasterFieldMapping,
} from '../lib/types';
import { DeliveryType } from '../lib/enums';

const defaultContextValue: ICreateTemplateContext = {
  existingTemplate: false,
  isSaveDisabled: true,
  errors: { infoError: false, fieldsError: false, fieldErrors: {} }, // Add fieldErrors
  selectedFieldIndex: -1,
  deliveryType: '',
  zapierType: '',
  formFieldMappingOptions: [],
  masterFieldMappings: [],
  setDeliveryType: () => {},
  setZapierType: () => {},

  formatRequestData: (updatedTemplateDataCopy: ITemplateResponse) => {
    return {} as ITemplateRequest;
  },
  setInitialTemplateData: (
    templateData: ITemplateResponse,
    existingTemplate,
  ) => {},
  updateTemplateData: (templateData: Partial<ITemplateResponse>) => {},
  updateFields: (fields: ITemplateFieldResponse[]) => {},
  updateErrorStatus: (errors: Record<string, boolean>) => {},
  updateFieldErrorStatus: (name: string, hasError: boolean) => {}, // Add new method
  updateReservedNames: (reservedNames: string[]) => {},
  resetTemplateDetails: () => {},
  getUpdatedTemplateDetails: (): ITemplateResponse => {
    return {} as ITemplateResponse;
  },
  getVisibleTemplateFields: (): ITemplateFieldResponse[] => {
    return [] as ITemplateFieldResponse[];
  },
  getFieldByIndex: (index: number): ITemplateFieldResponse => {
    return {} as ITemplateFieldResponse;
  },
  updateFieldByIndex: (
    index: number,
    fields: ITemplateFieldResponse,
    syncFields?: boolean,
  ) => {},
  closeFieldDrawer: () => {},
  selectField: (index: number) => {},
  updateFormFieldMappingOptions: (
    options: { label: string; value: string }[],
  ) => {},
  updateIntegrationsList: (
    deliveryType: string,
    integrations: { id: string; name: string }[],
  ) => {},
  updateMasterFieldMappings: (mappings: IMasterFieldMapping[]) => {},
  shouldReloadDependentData: false,
  setShouldReloadDependentData: () => {},
};

const CreateTemplateContext =
  createContext<ICreateTemplateContext>(defaultContextValue);

const CreatetemplateContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [templateId, setTemplateId] = useState<string>();
  const [existingTemplate, setExistingTemplate] = useState<boolean>(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
  const [templateData, setTemplateData] = useState<ITemplateInfo>();
  const [fields, setFields] = useState<ITemplateFieldResponse[]>([]);
  const [errors, setErrors] = useState<{
    infoError: boolean;
    fieldsError: boolean;
    fieldErrors: Record<string, boolean>;
  }>({
    infoError: false,
    fieldsError: false,
    fieldErrors: {},
  });
  const [sourceTemplateData, setSourceTemplateData] =
    useState<ITemplateResponse>();
  const [updatedTemplateData, setUpdatedTemplateData] =
    useState<ITemplateResponse>();
  const [destinationFieldNames, setDestinationFieldNames] = useState<string[]>(
    [],
  );
  const [reservedNames, setReservedNames] = useState<string[]>([]);
  const [visibleFieldsCount, setVisibleFieldsCount] = useState(0);
  const [isFieldDrawerOpen, setIsFieldDrawerOpen] = useState(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(-1);
  const [deliveryType, setDeliveryType] = useState<string>('');
  const [zapierType, setZapierTypeState] = useState<string>('');

  // Custom setter to sync zapierType and templateData.type
  const setZapierType = (type: string) => {
    setZapierTypeState(type);
    // Only update the updatedTemplateData, not templateData
    // templateData is a subset and updating it directly can cause data loss
    setUpdatedTemplateData((prevData) => {
      if (!prevData) return prevData;
      return {
        ...prevData,
        type: type as 'default' | 'custom' | 'Zaps' | 'Interfaces',
      };
    });
  };
  const [formFieldMappingOptions, setFormFieldMappingOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [integrationsList, setIntegrationsList] = useState<
    Record<string, { id: string; name: string }[]>
  >({});
  const [masterFieldMappings, setMasterFieldMappings] = useState<
    IMasterFieldMapping[]
  >([]);
  const [shouldReloadDependentData, setShouldReloadDependentData] =
    useState(false);

  useEffect(() => {
    if (updatedTemplateData?.fields?.length) {
      const destinationFieldNames = updatedTemplateData?.fields?.map((field) =>
        field.destination?.toLowerCase(),
      );
      const count = updatedTemplateData.fields.reduce(
        (acc, field) => (field.visible ? acc + 1 : acc),
        0,
      );
      setVisibleFieldsCount(count);
      setDestinationFieldNames(destinationFieldNames);
    }
  }, [updatedTemplateData]);

  useEffect(() => {
    if (!updatedTemplateData?.name || errors.infoError || errors.fieldsError) {
      setIsSaveDisabled(true);
    } else {
      setIsSaveDisabled(false);
    }
  }, [updatedTemplateData, errors]);

  // Sync template fields visibility and order with master field mappings
  const syncFieldsWithMasterMappings = (
    fields: ITemplateFieldResponse[],
    masterMappings: IMasterFieldMapping[],
  ): ITemplateFieldResponse[] => {
    return fields
      .map((field) => {
        // Find matching master field mapping by fieldValue
        const masterMapping = masterMappings.find(
          (mapping) => mapping.masterValue === field.fieldValue,
        );

        if (masterMapping) {
          // Update field with master mapping visibility, order, and destination
          return {
            ...field,
            visible: masterMapping.visible,
            order: masterMapping.order,
            // Set destination based on mapping availability
            destination:
              masterMapping.mappingName && masterMapping.mappingValue
                ? masterMapping.mappingValue // Use mappingValue for mapped fields
                : '', // Empty string for unmapped fields
          };
        }

        // If no master mapping found, keep original field
        return field;
      })
      .sort((a, b) => a.order - b.order); // Sort by order
  };

  const setInitialTemplateData = (
    templateData: ITemplateResponse,
    existingTemplate: boolean,
  ) => {
    const cloneTemplateData = cloneDeep(templateData);
    setSourceTemplateData({ ...cloneTemplateData });
    setExistingTemplate(existingTemplate);

    if (existingTemplate) {
      setTemplateId(templateData.id);
    }

    // Set delivery type if it exists
    if (templateData.deliveryType) {
      setDeliveryType(templateData.deliveryType);
    }

    // Master field mappings will be set when form fields are fetched

    // Set updated template data with synced fields
    setUpdatedTemplateData({ ...cloneTemplateData });
    setTemplateData(pickTemplateData(templateData));
    setErrors({ infoError: false, fieldsError: false, fieldErrors: {} }); // Reset errors
    setFields([...templateData.fields]);
  };

  const updateTemplateData = (
    updatingTemplateData: Partial<ITemplateResponse>,
  ) => {
    setUpdatedTemplateData((prevData) => {
      const newData = {
        ...prevData, // Preserve existing data
        ...updatingTemplateData, // Override with new data
      } as ITemplateResponse;
      // Update lineItemId and lineItemName if present in updatingTemplateData
      if ('lineItemId' in updatingTemplateData) {
        newData.lineItemId = updatingTemplateData.lineItemId;
      }
      if ('lineItemName' in updatingTemplateData) {
        newData.lineItemName = updatingTemplateData.lineItemName;
      }

      // If delivery type is changing from HubSpot to FlatFile, clear integration fields
      if (
        updatingTemplateData.deliveryType === DeliveryType.FLAT_FILE &&
        (prevData?.deliveryType === DeliveryType.HUBSPOT ||
          prevData?.deliveryType === DeliveryType.WEBFORM ||
          prevData?.deliveryType === DeliveryType.FTP ||
          prevData?.deliveryType === DeliveryType.ZAPIER)
      ) {
        newData.integrationId = undefined;
        newData.integrationName = undefined;
        newData.deliveryObject = undefined;
      } else {
        // Preserve deliveryObject if it's not explicitly being updated
        // This prevents accidental clearing when undefined is passed
        if (
          updatingTemplateData.deliveryObject === undefined &&
          prevData?.deliveryObject &&
          newData.deliveryType === DeliveryType.HUBSPOT // Only preserve for HubSpot
        ) {
          newData.deliveryObject = prevData.deliveryObject;
        }
      }

      // Auto-derive integrationName from integrationId for HubSpot delivery type
      if (
        (newData.deliveryType === DeliveryType.HUBSPOT ||
          newData.deliveryType === DeliveryType.WEBFORM ||
          newData.deliveryType === DeliveryType.FTP ||
          newData.deliveryType === DeliveryType.ZAPIER) &&
        newData.integrationId &&
        !updatingTemplateData.integrationName
      ) {
        // Look up integration name from cached list
        const integrations = integrationsList[newData.deliveryType] || [];
        const integration = integrations.find(
          (int) => int.id === newData.integrationId,
        );
        if (integration && integration.name) {
          newData.integrationName = integration.name;
        } else {
          // Fallback to integrationId if not found in list
          newData.integrationName = newData.integrationId;
        }
      }

      // Clear integration fields if deliveryType is FlatFile or integrationId is cleared
      if (
        newData.deliveryType === DeliveryType.FLAT_FILE ||
        (newData.deliveryType !== DeliveryType.HUBSPOT &&
          newData.deliveryType !== DeliveryType.WEBFORM &&
          newData.deliveryType !== DeliveryType.ZAPIER &&
          newData.deliveryType !== DeliveryType.FTP &&
          !newData.integrationId)
      ) {
        newData.integrationId = undefined;
        newData.integrationName = undefined;
        newData.deliveryObject = undefined;
      }

      return newData;
    });

    // Update delivery type if it's included in the update
    if (updatingTemplateData.deliveryType) {
      setDeliveryType(updatingTemplateData.deliveryType);
    }
  };

  const updateFormFieldMappingOptions = (
    options: { label: string; value: string }[],
  ) => {
    setFormFieldMappingOptions(options);
  };

  const updateIntegrationsList = (
    deliveryType: string,
    integrations: { id: string; name: string }[],
  ) => {
    setIntegrationsList((prev) => ({
      ...prev,
      [deliveryType]: integrations,
    }));
  };

  const updateMasterFieldMappings = (mappings: IMasterFieldMapping[]) => {
    setMasterFieldMappings(mappings);
    // Create new fields from master field mappings (source fields)
    const newFields: ITemplateFieldResponse[] = mappings.map((mapping) => ({
      id: mapping.id,
      mfId: mapping.id,
      fieldValue: mapping.masterValue,
      name: mapping.masterName,
      source: mapping.masterName,
      destination: mapping.mappingValue || '', // Empty destination
      order: mapping.order,
      visible: mapping.visible,
      example: '',
      description: '',
      confidence: '',
      status: 'active',
      type: 'default',
      isStandardField: mapping.isStandardField, // Pass through the isStandardField flag
      dataType: {
        name: 'String',
        value: 'string',
        description: 'Text data type',
      },
      characters: { minLength: null, maxLength: null },
      dataMapperFile: {
        fileName: '',
        id: '',
      },
    }));

    // Update fields directly to avoid form reset
    setFields(newFields);

    // Clear field errors since fields have been created
    setErrors((prev) => ({
      ...prev,
      fieldsError: false,
      fieldErrors: {},
    }));
  };

  const updateFields = (fields: ITemplateFieldResponse[]) => {
    setUpdatedTemplateData(
      (prevData) =>
        ({
          ...prevData,
          fields: [...fields],
        }) as ITemplateResponse,
    );
  };

  const updateErrorStatus = (errorInfo: Record<string, boolean>) => {
    setErrors({ ...errors, ...errorInfo });
  };

  const updateFieldErrorStatus = (name: string, hasError: boolean) => {
    const newFieldErrors = { ...errors.fieldErrors, [name]: hasError };
    setErrors({ ...errors, fieldErrors: newFieldErrors });
    const hasFieldErrors = Object.values(newFieldErrors).some((val) => val);
    updateErrorStatus({ fieldsError: hasFieldErrors });
  };

  const updateReservedNames = (reservedNames: string[]) => {
    setReservedNames([...reservedNames]);
  };

  const getUpdatedTemplateDetails = () => {
    const fieldsWithUpdatedLengths = updatedTemplateData?.fields?.map(
      (field) => {
        const min = field?.characters?.minLength ?? -2; // If minLength is not provided, use -2
        const max = field?.characters?.maxLength ?? -1; // If maxLength is not provided, use -1

        return {
          ...field,
          minLength: min,
          maxLength: max,
        };
      },
    );

    return {
      ...updatedTemplateData,
      fields: fieldsWithUpdatedLengths,
    } as ITemplateResponse;
  };

  const getVisibleTemplateFields = () => {
    return updatedTemplateData?.fields?.filter(
      (field) => field.visible,
    ) as ITemplateFieldResponse[];
  };

  const pickTemplateData = (templateData: ITemplateResponse) => {
    return {
      ...pick(templateData, [
        'id',
        'templateId',
        'name',
        'description',
        'deliveryType',
        'integrationId',
        'integrationName',
        'deliveryObject',
        // 'marketerCode',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'status',
        'type',
      ]),
      ...pick(templateData?.count, ['lineItems', 'clients']),
    };
  };

  const resetTemplateDetails = () => {
    const cloneTemplateSourceData = cloneDeep(
      sourceTemplateData as ITemplateResponse,
    );
    setUpdatedTemplateData({ ...cloneTemplateSourceData });
    setTemplateData(pickTemplateData({ ...cloneTemplateSourceData }));
    setFields([...(cloneTemplateSourceData?.fields || [])]);
    setErrors({ infoError: false, fieldsError: false, fieldErrors: {} });

    // Reset delivery type if it changed
    if (cloneTemplateSourceData?.deliveryType) {
      setDeliveryType(cloneTemplateSourceData.deliveryType);
    }

    // Clear master field mappings to trigger reload when form is selected again
    setMasterFieldMappings([]);

    // Clear form field mapping options
    setFormFieldMappingOptions([]);

    // Signal that dependent data needs to be reloaded
    setShouldReloadDependentData(true);
  };

  const getFieldByIndex = (index: number): ITemplateFieldResponse => {
    const field = {
      ...updatedTemplateData?.fields[index],
    } as ITemplateFieldResponse;

    field.dataTypeName = field?.dataTypeName ?? field?.dataType?.name;

    if (!field.characters) {
      field.characters = { minLength: null, maxLength: null };
    }
    field.characters.minLength =
      field.characters.minLength === -2 ? null : field.characters.minLength;
    field.characters.maxLength =
      field.characters.maxLength === -1 ? null : field.characters.maxLength;

    return field;
  };

  const updateFieldByIndex = (
    index: number,
    updatedField: ITemplateFieldResponse,
    syncFields = false,
  ) => {
    const updatedFields = [...(updatedTemplateData?.fields ?? [])];

    updatedFields[index] = updatedField;

    setUpdatedTemplateData(
      () =>
        ({
          ...updatedTemplateData,
          fields: updatedFields,
        }) as ITemplateResponse,
    );

    if (syncFields) {
      setFields([...(updatedFields as ITemplateFieldResponse[])]);
    }
  };

  const closeFieldDrawer = () => {
    setIsFieldDrawerOpen(false);
    setSelectedFieldIndex(-1);
  };

  const selectField = (index: number) => {
    setSelectedFieldIndex(index);
    setIsFieldDrawerOpen(true);
  };

  // ...existing code...
  const formatRequestData = (
    updatedTemplateDataCopy: ITemplateResponse,
    isUpdating = false,
  ) => {
    // Base properties that are always included
    const masterProperties = ['name', 'description', 'deliveryType']; //, 'marketerCode'];

    // Add integration-specific properties only for HubSpot delivery type
    if (updatedTemplateDataCopy.deliveryType === DeliveryType.HUBSPOT) {
      masterProperties.push(
        'integrationId',
        'integrationName',
        'deliveryObject',
      );
    }

    if (updatedTemplateDataCopy.deliveryType === DeliveryType.WEBFORM) {
      masterProperties.push('integrationId', 'integrationName');
    }

    if (updatedTemplateDataCopy.deliveryType === DeliveryType.ZAPIER) {
      masterProperties.push('integrationId', 'integrationName', 'type');
    }

    const fieldProperties = [
      'name',
      'source',
      'destination',
      'order',
      'visible',
      'description',
      'confidence',
      'fieldValue',
    ];

    if (isUpdating) {
      masterProperties.push('id');
      fieldProperties.push(...['id', 'mfId']);
    }

    const fields = updatedTemplateDataCopy.fields.map((field) => {
      const updatedField = updatedTemplateDataCopy.fields.find(
        (f) => f.name === field.name,
      );

      if (!updatedField) {
        return field;
      }

      const fieldMapping = {} as ITemplateFieldMapping;
      fieldMapping.min = updatedField.characters?.minLength ?? -2;
      fieldMapping.max = updatedField.characters?.maxLength ?? -1;
      fieldMapping.dataType = updatedField.dataTypeName;
      fieldMapping.dataMapperFileId = updatedField?.dataMapperFile?.id || null;

      const fieldItem = {
        ...pick(updatedField, fieldProperties),
        fieldMapping,
        status: 'active',
        type: 'default',
      };
      if (!isUpdating) {
        fieldItem.mfId = updatedField.id;
      }
      return fieldItem;
    });

    const requestData = pick(
      updatedTemplateDataCopy,
      masterProperties,
    ) as unknown as ITemplateRequest;

    // Set type based on delivery type
    if (
      updatedTemplateDataCopy.deliveryType === 'Zapier' &&
      updatedTemplateDataCopy.type
    ) {
      // For Zapier, use the selected type (Zaps or Interfaces)
      requestData.type = updatedTemplateDataCopy.type;
    } else {
      // For other delivery types, use default
      requestData.type = 'default';
    }

    requestData.status = 'active';
    requestData.fields = fields as ITemplateFieldRequest[];

    return requestData as unknown as ITemplateRequest;
  };
  // ...existing code...

  const contextValue = useMemo(
    () => ({
      templateId,
      existingTemplate,
      isSaveDisabled,
      errors,
      templateData,
      fields,
      updatedTemplateData,
      destinationFieldNames,
      reservedNames,
      visibleFieldsCount,
      isFieldDrawerOpen,
      selectedFieldIndex,
      deliveryType,
      zapierType,
      setZapierType,
      formFieldMappingOptions,
      masterFieldMappings,
      shouldReloadDependentData,
      formatRequestData,
      closeFieldDrawer,
      selectField,
      setInitialTemplateData,
      updateTemplateData,
      updateFields,
      updateErrorStatus,
      updateReservedNames,
      resetTemplateDetails,
      getUpdatedTemplateDetails,
      getVisibleTemplateFields,
      getFieldByIndex,
      updateFieldByIndex,
      updateFieldErrorStatus,
      updateFormFieldMappingOptions,
      updateIntegrationsList,
      updateMasterFieldMappings,
      setShouldReloadDependentData,
      setDeliveryType,
    }),
    [
      templateId,
      existingTemplate,
      isSaveDisabled,
      errors,
      templateData,
      fields,
      updatedTemplateData,
      destinationFieldNames,
      reservedNames,
      visibleFieldsCount,
      isFieldDrawerOpen,
      selectedFieldIndex,
      deliveryType,
      formFieldMappingOptions,
      masterFieldMappings,
      integrationsList,
      shouldReloadDependentData,
      setDeliveryType,
    ],
  );

  return (
    <CreateTemplateContext.Provider value={contextValue}>
      {children}
    </CreateTemplateContext.Provider>
  );
};

export { CreateTemplateContext, CreatetemplateContextProvider };
