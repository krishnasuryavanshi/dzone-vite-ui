import { Translate } from '@/components/i18n';
import { ItemType } from '@/lib/types/uicomponents';
import { Breadcrumb } from '@/uicomponents';
import { useEffect, useState } from 'react';
import { ILineItem } from '../../lib/types';
import { NextLink } from '@/components/shared';
import { ICampaign } from '../../../campaigns/lib/types';
import styles from './line-item-breadcrumbs.module.css';

export interface ICreateLineItemBreadcrumbsProps {
  campaignData?: ICampaign;
  id?: string;
  lineItemId?: string;
  lineItemDetails?: ILineItem;
}

export const LineItemBreadcrumbs: React.FC<ICreateLineItemBreadcrumbsProps> = ({
  campaignData,
  id,
  lineItemId,
}) => {
  const campaignId = campaignData?.campaignId;
  const [items, setItems] = useState<ItemType[]>([
    {
      title: <Translate i18nKey='pages.campaignManagement.title' />,
    },
  ]);

  useEffect(() => {
    if (campaignId && id && lineItemId) {
      setItems([
        {
          title: <Translate i18nKey='pages.campaignManagement.title' />,
        },
        {
          title: (
            <NextLink
              link={`/campaign-management/campaigns/${campaignId}`}
              label={campaignId}></NextLink>
          ),
        },
        {
          title: (
            <span className={`${styles.lineItemId} ${styles.hoverUnderline}`}>
              <NextLink
                link={`/campaign-management/line-items/${id}`}
                label={lineItemId}></NextLink>
            </span>
          ),
        },
        {
          title: <Translate i18nKey='form.editLineItem.edit' />,
        },
      ]);
    } else if (campaignData?.id && !id && !lineItemId) {
      setItems([
        {
          title: <Translate i18nKey='pages.campaignManagement.title' />,
        },
        {
          title: (
            <NextLink
              link={`/campaign-management/campaigns/${campaignData?.id}`}
              label={campaignId!}></NextLink>
          ),
        },
        {
          title: <Translate i18nKey='form.createLineItem.create' />,
        },
      ]);
    } else if (lineItemId && id) {
      setItems([
        {
          title: <Translate i18nKey='pages.campaignManagement.title' />,
        },
        {
          title: (
            <span className={`${styles.lineItemId} ${styles.hoverUnderline}`}>
              <NextLink
                link={`/campaign-management/line-items/${id}`}
                label={lineItemId}></NextLink>
            </span>
          ),
        },
        {
          title: <Translate i18nKey='form.editLineItem.edit' />,
        },
      ]);
    }
  }, [campaignId, id, lineItemId]);

  return <Breadcrumb items={items} />;
};
