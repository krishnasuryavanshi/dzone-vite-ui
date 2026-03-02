import { ITemplateInfo } from './template';
import { ITemplateField } from './template-field';

export interface ITemplateFieldMapping {
  dataType?: string;
  min: number;
  max: number;
  dataMapperFileId?: string | null;
}

export interface ITemplateFieldRequest extends ITemplateField {
  fieldMapping: ITemplateFieldMapping;
}

export interface ITemplateRequest extends ITemplateInfo {
  fields: ITemplateFieldRequest[];
}
