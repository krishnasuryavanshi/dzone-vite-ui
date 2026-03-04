import { Translate } from '@/components/i18n';
import { AppLink } from '@/components/shared';
import { ItemType } from '@/lib/types/uicomponents';
import { Breadcrumb } from '@/uicomponents';
import { useEffect, useState } from 'react';
import styles from './show-create-campaign-breadcrumbs.module.css';

interface IShowCampaignBreadcrumbProps {
  campaignId?: string;
  id?: string;
}

export const ShowCampaignBreadcrumb: React.FC<IShowCampaignBreadcrumbProps> = ({
  campaignId,
  id,
}) => {
  const [items, setItems] = useState<ItemType[]>([
    {
      title: <Translate i18nKey='pages.campaignManagement.title' />,
    },
    {
      title: (
        <Translate
          i18nKey={`${campaignId ? 'form.createCampaign.editFormHeader' : 'form.createCampaign.formHeader'}`}
        />
      ),
    },
  ]);
  useEffect(() => {
    if (campaignId && id) {
      setItems([
        {
          title: <Translate i18nKey='pages.campaignManagement.title' />,
        },
        {
          title: (
            <span className={`${styles.campaignId} ${styles.hoverUnderline}`}>
              <AppLink link={`/campaign-management/campaigns/${id}`} label={campaignId}></AppLink>
            </span>
          ),
        },
        {
          title: (
            <Translate
              i18nKey={`${campaignId ? 'form.createCampaign.editFormHeader' : 'form.createCampaign.formHeader'}`}
            />
          ),
        },
      ]);
    }
  }, [campaignId, id]);

  return <Breadcrumb items={items} />;
};
