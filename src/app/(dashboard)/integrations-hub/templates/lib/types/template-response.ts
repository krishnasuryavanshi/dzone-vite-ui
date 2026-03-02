import { ITemplateAssociationCount, ITemplateInfo } from './template';
import { ITemplateField } from './template-field';
import { ITemplateFieldDataType } from './template-field-data-type';

export interface IFieldValueCharacterLength {
  minLength: number | null;
  maxLength: number | null;
}

export interface IDataMapperFileDetails {
  fileName: string;
  id: string;
}
export interface ITemplateFieldResponse extends ITemplateField {
  dataType: ITemplateFieldDataType;
  characters: IFieldValueCharacterLength;
  dataMapperFile: IDataMapperFileDetails;
}

export interface ITemplateResponse extends ITemplateInfo {
  count: ITemplateAssociationCount;
  fields: ITemplateFieldResponse[];
}
