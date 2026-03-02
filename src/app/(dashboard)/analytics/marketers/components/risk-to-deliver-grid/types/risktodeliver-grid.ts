import { IRiskToLaunchGrids } from '../../risk-to-launch-grid/types/risktolaunch-grid';

export interface IRiskToDeliverGrids extends IRiskToLaunchGrids {
  targetGoal: number;
  leadsDelivered: number;
  pacingGap: number;
  endDate: string;
  daysLeft: number;
}
