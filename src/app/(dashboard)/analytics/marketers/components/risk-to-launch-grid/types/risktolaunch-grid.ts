import { Filters } from '@/lib/utils/table';
import { IMarketersGrids } from '../../../types/marketers-grids';
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
  TablePaginationConfig,
} from '@/lib/types/uicomponents';

export interface IRiskToLaunchGrids {
  campaign_name: string;
  line_item_name: string;
  supplier_name: string;
  target_start_date?: string;
  actual_start_date?: string;
  days_overdue?: number;
  at_risk_reason_to_launch: string;
}

type DaysOverdueLeft = {
  text: string;
  style: {
    color: string;
  };
};

export type TableRecord = {
  actual_start_date: string;
  at_risk_reason: string;
  at_risk_reason_to_launch: string | null;
  at_risk_to_deliver: string | null;
  campaign_name: string;
  days_left_overdue: DaysOverdueLeft;
  leads_delivered: string;
  line_item_id: string;
  line_item_name: string;
  pacing_gap: string;
  supplier_from_parent_flag: boolean;
  supplier_names: string;
  target_lead_goal: string;
  target_start_date: string;
};

export interface IMarketersGridsProps {
  lists: IMarketersGrids[];
  filterInfo: Filters<IMarketersGrids>;
  onFiltersChange?: (filters: Record<string, any>) => void;
  hasFilters?: boolean;
}
export interface DataType {
  key: React.Key;
  [key: string]: any;
}

export type SearchEventArg = {
  pagination: TablePaginationConfig;
  filters: Record<string, FilterValue | null>;
  sorter: SorterResult<DataType> | SorterResult<DataType>[];
  extra: TableCurrentDataSource<DataType>;
};
