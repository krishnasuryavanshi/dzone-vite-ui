import { DzRecord } from '@/lib/types';

export interface IValidationSettingRow {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;

  tenant: DzRecord;
  marketer: string | null;
}
