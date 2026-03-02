import { Key } from '@/lib/types/uicomponents';
export interface IMarketersGrids {
  campaign_name: string;
  line_item_name: string;
  supplier_names: string;
  target_start_date: string;
  actual_start_date: string;
  target_lead_goal: number;
  leads_delivered: number;
  pacing_gap: number;
  at_risk_reason_to_launch: string;
  at_risk_to_deliver: string;
  days_overdue_or_left: string;
  at_risk_reason: string;
  key: Key;
}
