import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';

export interface FetchPacingScheduleParams {
  lineItemId: string;
  lineItemTargetStartDate: string;
  targetDeliveryStartDate: string;
  lineItemTargetEndDate: string;
  targetLeadGoal: number;
  pacingSchedule: string;
  pacing?: string;
  allowOverflow: boolean;
  deficitManagement: boolean;
}

export interface ScheduleItem {
  id: string;
  period: number;
  date: string;
  day: string;
  LeadsCount: number;
}

export interface PacingPeriod {
  id: string;
  period: number;
  pacingPeriod: string;
  days: string;
  LeadsCount: number;
  schedules: ScheduleItem[];
}

export const fetchPacingSchedule = async (
  params: FetchPacingScheduleParams,
) => {
  try {
    const data = await nextBackendRequest({
      resource: BackendResources.FetchPacingSchedules,
      params: {
        lineItemId: params.lineItemId,
        targetDeliveryStartDate: params.targetDeliveryStartDate,
        lineItemTargetStartDate: params.lineItemTargetStartDate,
        lineItemTargetEndDate: params.lineItemTargetEndDate,
        targetLeadGoal: params.targetLeadGoal.toString(),
        pacingSchedule: params.pacingSchedule,
        pacing: params.pacing,
        allowOverflow: params.allowOverflow.toString(),
        deficitManagement: params.deficitManagement.toString(),
      },
    });

    return data?.data || [];
  } catch (error) {
    logError(error);
    return null;
  }
};
