import { cloneDeep, pick } from 'lodash';
import { create } from 'zustand';
import { DeliveryType, TemplateStep } from '../lib/enums';
import {
  IMasterFieldMapping,
  ITemplateFieldMapping,
  ITemplateFieldRequest,
  ITemplateFieldResponse,
  ITemplateInfo,
  ITemplateRequest,
  ITemplateResponse,
} from '../lib/types';

interface TemplateStoreState {
  // Step state
  currentStep: TemplateStep;
  isAiMappingLoading: boolean;

  // Template data
  templateId?: string;
  existingTemplate: boolean;
  sourceTemplateData?: ITemplateResponse;
  updatedTemplateData?: ITemplateResponse;
  templateData?: ITemplateInfo;
  fields: ITemplateFieldResponse[];

  // UI state
  errors: {
    infoError: boolean;
    fieldsError: boolean;
    fieldErrors: Record<string, boolean>;
  };
  destinationFieldNames: string[];
  reservedNames: string[];
  visibleFieldsCount: number;
  isSaveDisabled: boolean;
  isFieldDrawerOpen: boolean;
  selectedFieldIndex: number;

  // Delivery type state
  deliveryType: string;
  zapierType: string;
  formFieldMappingOptions: { label: string; value: string }[];
  integrationsList: Record<string, { id: string; name: string }[]>;
  masterFieldMappings: IMasterFieldMapping[];
  shouldReloadDependentData: boolean;
}

interface TemplateStoreActions {
  // Step actions
  setCurrentStep: (step: TemplateStep) => void;
  setAiMappingLoading: (loading: boolean) => void;

  // Template data actions
  setInitialTemplateData: (
    templateData: ITemplateResponse,
    existingTemplate: boolean,
  ) => void;
  updateTemplateData: (
    updatingTemplateData: Partial<ITemplateResponse>,
  ) => void;
  updateFields: (fields: ITemplateFieldResponse[]) => void;
  updateFieldByIndex: (
    index: number,
    field: ITemplateFieldResponse,
    syncFields?: boolean,
  ) => void;
  resetTemplateDetails: () => void;
  getUpdatedTemplateDetails: () => ITemplateResponse;
  getVisibleTemplateFields: () => ITemplateFieldResponse[];
  getFieldByIndex: (index: number) => ITemplateFieldResponse;

  // Error actions
  updateErrorStatus: (errors: Record<string, boolean>) => void;
  updateFieldErrorStatus: (name: string, hasError: boolean) => void;
  updateReservedNames: (reservedNames: string[]) => void;

  // Field drawer actions
  closeFieldDrawer: () => void;
  selectField: (index: number) => void;

  // Delivery type actions
  setDeliveryType: (type: string) => void;
  setZapierType: (type: string) => void;
  updateFormFieldMappingOptions: (
    options: { label: string; value: string }[],
  ) => void;
  updateIntegrationsList: (
    deliveryType: string,
    integrations: { id: string; name: string }[],
  ) => void;
  updateMasterFieldMappings: (mappings: IMasterFieldMapping[]) => void;
  setShouldReloadDependentData: (value: boolean) => void;

  // Format request data
  formatRequestData: (
    updatedTemplateDataCopy: ITemplateResponse,
    isUpdating?: boolean,
  ) => ITemplateRequest;

  // Reset store
  resetStore: () => void;
}

type TemplateStore = TemplateStoreState & TemplateStoreActions;

const initialState: TemplateStoreState = {
  currentStep: TemplateStep.Configuration,
  isAiMappingLoading: false,
  templateId: undefined,
  existingTemplate: false,
  sourceTemplateData: undefined,
  updatedTemplateData: undefined,
  templateData: undefined,
  fields: [],
  errors: { infoError: false, fieldsError: false, fieldErrors: {} },
  destinationFieldNames: [],
  reservedNames: [],
  visibleFieldsCount: 0,
  isSaveDisabled: true,
  isFieldDrawerOpen: false,
  selectedFieldIndex: -1,
  deliveryType: '',
  zapierType: '',
  formFieldMappingOptions: [],
  integrationsList: {},
  masterFieldMappings: [],
  shouldReloadDependentData: false,
};

const pickTemplateData = (templateData: ITemplateResponse): ITemplateInfo => {
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
      'createdAt',
      'updatedAt',
      'deletedAt',
      'status',
      'type',
      'lineItemId',
      'lineItemName',
    ]),
    ...pick(templateData?.count, ['lineItems', 'clients']),
    // Extract from nested lineItem object if available
    ...(templateData?.lineItem && {
      lineItemId: templateData.lineItem.id,
      lineItemName: templateData.lineItem.name,
    }),
  } as ITemplateInfo;
};

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  ...initialState,

  // Step actions
  setCurrentStep: (step) => set({ currentStep: step }),
  setAiMappingLoading: (loading) => set({ isAiMappingLoading: loading }),

  // Template data actions
  setInitialTemplateData: (templateData, existingTemplate) => {
    const cloneTemplateData = cloneDeep(templateData);

    // Extract lineItemName from nested lineItem object if available
    const lineItemData = templateData?.lineItem
      ? {
          lineItemId: templateData.lineItem.id,
          lineItemName: templateData.lineItem.name,
        }
      : {};

    // Calculate visibleFieldsCount
    const visibleFieldsCount =
      templateData.fields?.reduce(
        (acc, field) => (field.visible ? acc + 1 : acc),
        0,
      ) || 0;

    // Calculate isSaveDisabled - for existing templates with a name, enable save
    const isSaveDisabled = !templateData?.name;

    set({
      sourceTemplateData: { ...cloneTemplateData },
      existingTemplate,
      templateId: existingTemplate ? templateData.id : undefined,
      deliveryType: templateData.deliveryType || '',
      updatedTemplateData: { ...cloneTemplateData, ...lineItemData },
      templateData: pickTemplateData(templateData),
      errors: { infoError: false, fieldsError: false, fieldErrors: {} },
      fields: [...templateData.fields],
      visibleFieldsCount,
      isSaveDisabled,
      // For edit mode, skip to field mapping step
      currentStep: existingTemplate
        ? TemplateStep.FieldMapping
        : TemplateStep.Configuration,
    });
  },

  updateTemplateData: (updatingTemplateData) => {
    const state = get();
    const prevData = state.updatedTemplateData;
    const integrationsList = state.integrationsList;

    const newData = {
      ...prevData,
      ...updatingTemplateData,
    } as ITemplateResponse;

    // Update lineItemId and lineItemName if present
    if ('lineItemId' in updatingTemplateData) {
      newData.lineItemId = updatingTemplateData.lineItemId;
    }
    if ('lineItemName' in updatingTemplateData) {
      newData.lineItemName = updatingTemplateData.lineItemName;
    }

    // If delivery type is changing from HubSpot/WebForm/Zapier/FTP to FlatFile, clear integration fields
    if (
      updatingTemplateData.deliveryType === 'FlatFile' &&
      (prevData?.deliveryType === 'HubSpot' ||
        prevData?.deliveryType === 'WebForm' ||
        prevData?.deliveryType === DeliveryType.ZAPIER ||
        prevData?.deliveryType === DeliveryType.FTP)
    ) {
      newData.integrationId = undefined;
      newData.integrationName = undefined;
      newData.deliveryObject = undefined;
      // Reset type to default when switching away from Zapier
      if (prevData?.deliveryType === DeliveryType.ZAPIER) {
        newData.type = 'default';
      }
    } else if (
      // When switching from Zapier to any other delivery type (not FlatFile)
      prevData?.deliveryType === DeliveryType.ZAPIER &&
      updatingTemplateData.deliveryType &&
      updatingTemplateData.deliveryType !== DeliveryType.ZAPIER
    ) {
      // Reset type to default when switching away from Zapier
      newData.type = 'default';
    } else {
      // Preserve deliveryObject if not explicitly updated for HubSpot
      if (
        updatingTemplateData.deliveryObject === undefined &&
        prevData?.deliveryObject &&
        newData.deliveryType === 'HubSpot'
      ) {
        newData.deliveryObject = prevData.deliveryObject;
      }
    }

    // Auto-derive integrationName from integrationId
    if (
      (newData.deliveryType === 'HubSpot' ||
        newData.deliveryType === 'WebForm' ||
        newData.deliveryType === DeliveryType.ZAPIER) &&
      newData.integrationId &&
      !updatingTemplateData.integrationName
    ) {
      const integrations = integrationsList[newData.deliveryType] || [];
      const integration = integrations.find(
        (int) => int.id === newData.integrationId,
      );
      if (integration?.name) {
        newData.integrationName = integration.name;
      } else {
        newData.integrationName = newData.integrationId;
      }
    }

    // Clear integration fields if deliveryType is FlatFile
    if (
      newData.deliveryType === 'FlatFile' ||
      (newData.deliveryType !== 'HubSpot' &&
        newData.deliveryType !== 'WebForm' &&
        newData.deliveryType !== DeliveryType.ZAPIER &&
        newData.deliveryType !== DeliveryType.FTP &&
        !newData.integrationId)
    ) {
      newData.integrationId = undefined;
      newData.integrationName = undefined;
      newData.deliveryObject = undefined;
    }

    // Calculate visible fields count and destination names
    let visibleFieldsCount = 0;
    let destinationFieldNames: string[] = [];
    if (newData?.fields?.length) {
      destinationFieldNames = newData.fields.map((field) =>
        field.destination?.toLowerCase(),
      );
      visibleFieldsCount = newData.fields.reduce(
        (acc, field) => (field.visible ? acc + 1 : acc),
        0,
      );
    }

    // Calculate isSaveDisabled
    const errors = state.errors;
    const isSaveDisabled =
      !newData?.name || errors.infoError || errors.fieldsError;

    set({
      updatedTemplateData: newData,
      deliveryType: updatingTemplateData.deliveryType || state.deliveryType,
      destinationFieldNames,
      visibleFieldsCount,
      isSaveDisabled,
    });
  },

  updateFields: (fields) => {
    const state = get();
    const newData = {
      ...state.updatedTemplateData,
      fields: [...fields],
    } as ITemplateResponse;

    // Recalculate derived values
    const destinationFieldNames = fields.map((field) =>
      field.destination?.toLowerCase(),
    );
    const visibleFieldsCount = fields.reduce(
      (acc, field) => (field.visible ? acc + 1 : acc),
      0,
    );

    set({
      updatedTemplateData: newData,
      destinationFieldNames,
      visibleFieldsCount,
    });
  },

  updateFieldByIndex: (index, updatedField, syncFields = false) => {
    const state = get();
    const updatedFields = [...(state.updatedTemplateData?.fields ?? [])];
    updatedFields[index] = updatedField;

    const newData = {
      ...state.updatedTemplateData,
      fields: updatedFields,
    } as ITemplateResponse;

    const updates: Partial<TemplateStoreState> = {
      updatedTemplateData: newData,
    };

    if (syncFields) {
      updates.fields = [...updatedFields];
    }

    set(updates);
  },

  resetTemplateDetails: () => {
    const state = get();
    const cloneTemplateSourceData = cloneDeep(
      state.sourceTemplateData as ITemplateResponse,
    );

    set({
      updatedTemplateData: { ...cloneTemplateSourceData },
      templateData: pickTemplateData({ ...cloneTemplateSourceData }),
      fields: [...(cloneTemplateSourceData?.fields || [])],
      errors: { infoError: false, fieldsError: false, fieldErrors: {} },
      deliveryType: cloneTemplateSourceData?.deliveryType || '',
      masterFieldMappings: [],
      formFieldMappingOptions: [],
      shouldReloadDependentData: true,
    });
  },

  getUpdatedTemplateDetails: () => {
    const state = get();
    const fieldsWithUpdatedLengths = state.updatedTemplateData?.fields?.map(
      (field) => {
        const min = field?.characters?.minLength ?? -2;
        const max = field?.characters?.maxLength ?? -1;
        return {
          ...field,
          minLength: min,
          maxLength: max,
        };
      },
    );

    return {
      ...state.updatedTemplateData,
      fields: fieldsWithUpdatedLengths,
    } as ITemplateResponse;
  },

  getVisibleTemplateFields: () => {
    const state = get();
    return state.updatedTemplateData?.fields?.filter(
      (field) => field.visible,
    ) as ITemplateFieldResponse[];
  },

  getFieldByIndex: (index) => {
    const state = get();
    const field = {
      ...state.updatedTemplateData?.fields[index],
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
  },

  // Error actions
  updateErrorStatus: (errorInfo) => {
    const state = get();
    const newErrors = { ...state.errors, ...errorInfo };

    // Recalculate isSaveDisabled
    const isSaveDisabled =
      !state.updatedTemplateData?.name ||
      newErrors.infoError ||
      newErrors.fieldsError;

    set({ errors: newErrors, isSaveDisabled });
  },

  updateFieldErrorStatus: (name, hasError) => {
    const state = get();
    const newFieldErrors = { ...state.errors.fieldErrors, [name]: hasError };
    const hasFieldErrors = Object.values(newFieldErrors).some((val) => val);
    const newErrors = {
      ...state.errors,
      fieldErrors: newFieldErrors,
      fieldsError: hasFieldErrors,
    };

    const isSaveDisabled =
      !state.updatedTemplateData?.name ||
      newErrors.infoError ||
      newErrors.fieldsError;

    set({ errors: newErrors, isSaveDisabled });
  },

  updateReservedNames: (reservedNames) => set({ reservedNames }),

  // Field drawer actions
  closeFieldDrawer: () =>
    set({ isFieldDrawerOpen: false, selectedFieldIndex: -1 }),

  selectField: (index) =>
    set({ selectedFieldIndex: index, isFieldDrawerOpen: true }),

  // Delivery type actions
  setDeliveryType: (type) => set({ deliveryType: type }),

  setZapierType: (type) => {
    const state = get();
    set({
      zapierType: type,
      updatedTemplateData: state.updatedTemplateData
        ? {
            ...state.updatedTemplateData,
            type: type as ITemplateResponse['type'],
          }
        : state.updatedTemplateData,
    });
  },

  updateFormFieldMappingOptions: (options) =>
    set({ formFieldMappingOptions: options }),

  updateIntegrationsList: (deliveryType, integrations) => {
    const state = get();
    set({
      integrationsList: {
        ...state.integrationsList,
        [deliveryType]: integrations,
      },
    });
  },

  updateMasterFieldMappings: (mappings) => {
    // Create new fields from master field mappings (source fields)
    const newFields: ITemplateFieldResponse[] = mappings.map((mapping) => ({
      id: mapping.id,
      mfId: mapping.id,
      fieldValue: mapping.masterValue,
      name: mapping.masterName,
      source: mapping.masterName,
      destination: mapping.mappingValue || '',
      order: mapping.order,
      visible: mapping.visible,
      example: '',
      description: '',
      confidence: mapping.confidence ?? 0,
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

    set({
      masterFieldMappings: mappings,
      fields: newFields,
      errors: {
        infoError: get().errors.infoError,
        fieldsError: false,
        fieldErrors: {},
      },
    });
  },

  setShouldReloadDependentData: (value) =>
    set({ shouldReloadDependentData: value }),

  // Format request data
  formatRequestData: (updatedTemplateDataCopy, isUpdating = false) => {
    const masterProperties = [
      'name',
      'description',
      'deliveryType',
      'lineItemId',
    ];

    if (updatedTemplateDataCopy.deliveryType === 'HubSpot') {
      masterProperties.push(
        'integrationId',
        'integrationName',
        'deliveryObject',
      );
    }

    if (
      updatedTemplateDataCopy.deliveryType === 'WebForm' ||
      updatedTemplateDataCopy.deliveryType === DeliveryType.FTP ||
      updatedTemplateDataCopy.deliveryType === DeliveryType.ZAPIER
    ) {
      masterProperties.push('integrationId', 'integrationName');
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
      fieldProperties.push('id', 'mfId');
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
    // Use the actual type for Zapier, otherwise use 'default'
    if (
      updatedTemplateDataCopy.deliveryType === DeliveryType.ZAPIER &&
      updatedTemplateDataCopy.type
    ) {
      requestData.type = updatedTemplateDataCopy.type;
    } else {
      requestData.type = 'default';
    }
    requestData.status = 'active';
    requestData.fields = fields as ITemplateFieldRequest[];

    return requestData;
  },

  // Reset store
  resetStore: () => set(initialState),
}));
