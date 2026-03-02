export interface IPacingChartType {
  date: string;
  dayOfAWeek: string;
  leadsRequired: number;
}

export interface IPacingRequestData {
  targetDeliveryStartDate: string | null;
  lineItemTargetStartDate: string | null;
  lineItemTargetEndDate: string | null;
  targetLeadGoal?: number;
  pacingSchedule: string | null;
  pacing: string | null;
  allowOverflow: string | null;
  deficitManagement: string | null;
}
