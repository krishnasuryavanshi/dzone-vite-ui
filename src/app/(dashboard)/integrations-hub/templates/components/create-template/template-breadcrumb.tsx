import { Translate } from '@/components/i18n';
import { NextLink } from '@/components/shared';
import { useQueryState } from '@/lib/hooks';
import { ItemType } from '@/lib/types/uicomponents';
import { Breadcrumb } from '@/uicomponents';
import { useEffect, useState } from 'react';
import styles from './template-breadcrumb.module.css';

interface ITemplateBreadcrumbProps {
  existingTemplate?: boolean;
}

export const TemplateBreadcrumb: React.FC<ITemplateBreadcrumbProps> = ({
  existingTemplate = false,
}) => {
  const { queryState } = useQueryState();

  const [items, setItems] = useState<ItemType[]>([
    {
      title: <Translate i18nKey='pages.delivery.title' />,
    },
    {
      title: (
        <NextLink
          link={`/integrations-hub/templates`}
          label='pages.templates.title'></NextLink>
      ),
    },
    {
      title: <Translate i18nKey='pages.templates.label.createTemplate' />,
    },
  ]);

  useEffect(() => {
    if (existingTemplate && queryState?.id) {
      const breadCrumbitems = [...items];
      breadCrumbitems[2] = {
        title: <Translate i18nKey='pages.templates.label.editTemplate' />,
      };
      breadCrumbitems[3] = {
        title: queryState.id,
      };

      setItems(breadCrumbitems);
    }
  }, [existingTemplate, queryState?.id]);

  return <Breadcrumb items={items} />;
};
