export enum PacingSummaryStatus {
  InProgress = 'In Progress',
  Deficit = 'Deficit',
  Overflow = 'Overflow',
  OnTrack = 'On Track',
  Upcoming = 'Upcoming',
}

// GET /pacing-performance/{id}/summary — feeds KPI cards
export interface IPacingSummary {
  periodLabel: string;
  expected: number;
  published: number;
  variance: number;
  delivered: number | null;
  held: string;
  status: string;
}

// Daily breakdown item inside a grid row
export interface IPacingDailyBreakdown {
  id: string;
  periodLabel: string;
  expected: number;
  published: number;
  variance: number;
  delivered: number | null;
  held: number;
  status: string;
}

// Grid row from GET /pacing-performance/{id}
export interface IPacingSummaryRow {
  id: string;
  lineItemId: string;
  periodType: string;
  periodStartDate: string;
  periodEndDate: string;
  periodLabel: string;
  expected: number;
  published: number;
  variance: number;
  delivered: number | null;
  held: number;
  status: string;
  dailyBreakdown: IPacingDailyBreakdown[] | null;
}
