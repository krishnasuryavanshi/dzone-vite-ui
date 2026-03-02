export type supplierDataParams = {
  startDate?: string;
  endDate?: string;
  listItemList?: string[];
  marketerList?: string[];
  asOfDate?: string;
  campaignList?: string[];
};
export type MarketerDataParams = {
  startDate?: string;
  endDate?: string;
  campaignList?: string[];
  supplierList?: string[];
  asOfDate?: string;
  lineItemList?: string[];
  tenantCodes?: string[];
};

export type returnReasonBreakdown = {
  normalized_return_reason: string;
  returned_count: number;
};

export type topInvalidReasons = {
  invalid_reason: string;
  cnt: number;
};

export type validationData = {
  lead_state: string;
  count: number;
};

export type validationBreakdown = {
  validation_data: validationData | null;
  top_invalid_reasons: topInvalidReasons | null;
};

export type atRiskCollection = {
  line_item_name: string;
  parent_line_item_name: string;
  marketer_name: string;
  target_goal: number;
  leads_published: number;
  leads_remaining: number;
  target_end_date: string;
  days_left: number;
  at_risk_reason: string;
};

export type supplierDashboardDataResponse = {
  last_updated: string;
  lead_goal_assigned: number;
  lead_goal_assigned_pct_change_week: number | null;
  lead_goal_assigned_pct_change_month: number | null;
  lead_goal_assigned_pct_change_quarter: number | null;
  lead_goal_assigned_pct_change_year: number | null;
  leads_uploaded: number;
  leads_uploaded_pct_change_week: number | null;
  leads_uploaded_pct_change_month: number | null;
  leads_uploaded_pct_change_quarter: number | null;
  leads_uploaded_pct_change_year: number | null;
  leads_published: number;
  leads_published_pct_change_week: number | null;
  leads_published_pct_change_month: number | null;
  leads_published_pct_change_quarter: number | null;
  leads_published_pct_change_year: number | null;
  leads_returned: number;
  leads_returned_pct_change_week: number | null;
  leads_returned_pct_change_month: number | null;
  leads_returned_pct_change_quarter: number | null;
  leads_returned_pct_change_year: number | null;
  leads_pending: number;
  estimated_earnings: number;
  estimated_earnings_pct_change_week: number | null;
  estimated_earnings_pct_change_month: number | null;
  estimated_earnings_pct_change_quarter: number | null;
  estimated_earnings_pct_change_year: number | null;
  return_rate_pct: number;
  return_rate_pct_change_week: number | null;
  return_rate_pct_change_month: number | null;
  return_rate_pct_change_quarter: number | null;
  return_rate_pct_change_year: number | null;
  return_reasons_breakdown: returnReasonBreakdown[] | null;
  validation_breakdown: validationBreakdown;
  at_risk: atRiskCollection[] | null;
};

export enum FILTERTYPE {
  CAMPAIGN = 'campaign',
  SUPPLIER = 'supplier',
  LINEITEM = 'lineItem',
  MARKETER = 'marketer',
}
