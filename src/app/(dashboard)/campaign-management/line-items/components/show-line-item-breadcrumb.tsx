'use client';
import { Translate } from '@/components/i18n';
import { ItemType } from '@/lib/types/uicomponents';
import { Breadcrumb } from '@/uicomponents';
import { FC, useEffect, useState } from 'react';
import styles from './show-line-item-breadcrumb.module.css';

interface IShowLineItemBreadcrumbProps {
  campaignUuid?: string;
  campaignId?: string;
  id?: string;
  lineItemId?: string;
}

export const ShowLineItemBreadcrumb: FC<IShowLineItemBreadcrumbProps> = ({
  campaignUuid,
  campaignId,
  lineItemId,
}) => {
  const [items, setItems] = useState<ItemType[]>([
    {
      title: <Translate i18nKey='pages.campaignManagement.title' />,
    },
  ]);

  useEffect(() => {
    if (campaignUuid && campaignId && lineItemId) {
      setItems([
        {
          title: <Translate i18nKey='pages.campaignManagement.title' />,
        },
        {
          title: campaignId,
          href: `/campaign-management/campaigns/${campaignUuid}`,
        },
        {
          title: <span className={styles.lineItemId}>{lineItemId}</span>,
        },
        {
          title: <Translate i18nKey='pages.lineItems.label.viewLineItem' />,
        },
      ]);
    } else {
      setItems([
        {
          title: <Translate i18nKey='pages.campaignManagement.title' />,
        },
        {
          title: <span className={styles.lineItemId}>{lineItemId}</span>,
        },
        {
          title: <Translate i18nKey='pages.lineItems.label.viewLineItem' />,
        },
      ]);
    }
  }, [campaignUuid, campaignId, lineItemId]);

  return <Breadcrumb items={items} />;
};
