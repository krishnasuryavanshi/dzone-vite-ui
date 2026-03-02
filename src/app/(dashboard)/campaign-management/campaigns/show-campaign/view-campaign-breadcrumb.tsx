'use client';
import { Translate } from '@/components/i18n';
import { Breadcrumb } from '@/uicomponents';
import React, { FC } from 'react';
import styles from './view-campaign-breadcrumb.module.css';

interface IViewCampaignBreadcrumbProps {
  campaignId?: string;
}

export const ViewCampaignBreadcrumb: FC<IViewCampaignBreadcrumbProps> = ({
  campaignId,
}) => {
  const breadcrumb = [
    {
      title: <Translate i18nKey='pages.campaignManagement.title' />,
    },
    {
      title: (
        <span className={`${styles.campaignId} ${styles.hoverUnderline}`}>
          {campaignId}
        </span>
      ),
    },
    {
      title: <Translate i18nKey='pages.campaigns.label.viewCampaign' />,
    },
  ];
  return <Breadcrumb items={breadcrumb} />;
};
