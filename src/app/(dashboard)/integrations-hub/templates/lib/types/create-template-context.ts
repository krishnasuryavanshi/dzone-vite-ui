import { ITemplateInfo } from './template';
import { ITemplateRequest } from './template-request';
import { ITemplateFieldResponse, ITemplateResponse } from './template-response';
import { IMasterFieldMapping } from './field-mapping';

export interface ICreateTemplateContext {
  templateId?: string;
  existingTemplate?: boolean;
  sourceTemplateData?: ITemplateResponse;
  updatedTemplateData?: ITemplateResponse;
  templateData?: ITemplateInfo;
  fields?: ITemplateFieldResponse[];
  errors: {
    infoError: boolean;
    fieldsError: boolean;
    fieldErrors: any;
  };
  destinationFieldNames?: string[];
  reservedNames?: string[];
  visibleFieldsCount?: number;
  isSaveDisabled: boolean;
  selectedFieldIndex: number;
  isFieldDrawerOpen?: boolean;
  deliveryType: string;
  setDeliveryType: (type: string) => void;
  formFieldMappingOptions?: { label: string; value: string }[];
  masterFieldMappings?: IMasterFieldMapping[];

  formatRequestData: (
    updatedTemplateDataCopy: ITemplateResponse,
    isUpdating?: boolean,
  ) => ITemplateRequest;
  closeFieldDrawer: () => void;
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
  updateErrorStatus: (error: Record<string, boolean>) => void;
  updateReservedNames: (reservedNames: string[]) => void;
  resetTemplateDetails: () => void;
  getUpdatedTemplateDetails: () => ITemplateResponse;
  getVisibleTemplateFields: () => ITemplateFieldResponse[];
  getFieldByIndex: (index: number) => ITemplateFieldResponse;
  updateFieldErrorStatus: (name: string, hasError: boolean) => void;
  selectField: (index: number) => void;
  updateFormFieldMappingOptions: (
    options: { label: string; value: string }[],
  ) => void;
  updateIntegrationsList: (
    deliveryType: string,
    integrations: { id: string; name: string }[],
  ) => void;
  updateMasterFieldMappings: (mappings: IMasterFieldMapping[]) => void;
  shouldReloadDependentData?: boolean;
  setShouldReloadDependentData: (value: boolean) => void;
  zapierType: string;
  setZapierType: (type: string) => void;
}
