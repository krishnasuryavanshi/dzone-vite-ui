export interface IMasterFieldMapping {
  id: string;
  masterName: string;
  masterValue: string;
  mappingName: string | null;
  mappingValue: string | null;
  order: number;
  visible: boolean;
  confidence?: number;
  isStandardField?: boolean;
}
