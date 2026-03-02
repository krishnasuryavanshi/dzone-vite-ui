import { IStatus } from '@/app/(dashboard)/campaign-management/lib/types';

export interface IExcecutiveGrids {
  clientName: string;
  campaignName: string;
  ioNumber: string;
  clientUUID: string;
  campaignUUID: string;
  status: IStatus;
  bookedRevenue: number;
  leadsGoal: number;
  leadsDelivered: number;
  valueAddLeads: number;
  invoiced: number;
}
