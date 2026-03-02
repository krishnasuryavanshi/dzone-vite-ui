import { ICampaign } from '../../../campaigns/lib/types';
import { CampaignStatus } from '../../../components';
import { CampaignStatusAction } from '../../../campaigns/components';
import { StatusAction } from '../../../components/show-page/status-action';
import { ILineItem } from '../../../line-items/lib/types';

export const statusRenderer = (
  _val: unknown,
  record: ICampaign | ILineItem,
) => {
  if ('lineItemId' in record) {
    return <StatusAction record={record} />;
  } else if ('campaignId' in record && record.status.name === 'DRAFT') {
    return <CampaignStatusAction record={record} />;
  } else {
    return <CampaignStatus status={record.status} />;
  }
};
