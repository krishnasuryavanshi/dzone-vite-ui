export interface ITemplateField {
  id?: string;
  mfId?: string;
  fieldValue: string;
  name: string;
  source: string;
  destination: string;
  order: number;
  visible: boolean;
  description: string;
  example: string;
  confidence: string | number;
  status: string;
  type: 'default' | 'custom' | 'Zaps' | 'Interfaces';
  isStandardField?: boolean;

  dataTypeName?: string;
}
