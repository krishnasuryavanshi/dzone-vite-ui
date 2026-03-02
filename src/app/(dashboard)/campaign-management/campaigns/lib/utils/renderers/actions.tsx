import { CampaignRowActions } from '../../../campaign-row-actions';
import { ICampaign } from '../../types';

export const actionsRenderer = (_val: unknown, record: ICampaign) => {
  return <CampaignRowActions campaign={record} />;
};
