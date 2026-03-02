import { ICampaign } from '../../campaigns/lib/types';
import { ILineItem } from '../../line-items/lib/types';

export interface IShowItemFieldsProps {
  itemDetails?: ILineItem | ICampaign;
  formConfig: any;
  isCollapsed: boolean;
  summaryViewFields: string[];
}

export interface IShowItemDetailsProps extends IShowItemFieldsProps {
  updateUrl: string;
  stepCount: number;
  pageLabel: string;
  type: 'lineItem' | 'campaign';
}
