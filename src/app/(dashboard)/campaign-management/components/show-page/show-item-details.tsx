import { DzBox } from '@/components/layout/v1';
import { FC, useEffect, useState } from 'react';
import { Translate } from '@/components/i18n';
import { Text } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { usePathname } from '@/lib/hooks/use-router';
import { ShowDetailsSectionFooterAction } from './show-details-section-footer-actions';
import { ILineItem } from '../../line-items/lib/types';
import { ShowItemFields } from './show-item-fields';
import { IShowItemDetailsProps } from '../../lib/types';
import { ICampaign } from '../../campaigns/lib/types';

export const ShowItemDetails: FC<IShowItemDetailsProps> = ({
  itemDetails,
  updateUrl,
  formConfig,
  summaryViewFields,
  pageLabel,
  type,
}) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [updateLink, setUpdateLink] = useState('');

  useEffect(() => {
    if (itemDetails) {
      const updateItemLink = `${pathname}/${updateUrl}`;
      setUpdateLink(updateItemLink);
    }
  }, [itemDetails]);
  const handleCollapse = (collapsedState: boolean) => {
    setIsCollapsed(collapsedState);
  };

  return (
    <Flex vertical gap='0.75rem'>
      <Text strong style={{ marginBottom: '0' }}>
        <Translate i18nKey={pageLabel} />
      </Text>

      <DzBox dzOneBox>
        <ShowDetailsSectionFooterAction
          itemUuid={itemDetails?.id}
          marketerCode={itemDetails?.marketerCode || ''}
          formConfig={formConfig}
          type={type}
          isCollapsed={isCollapsed}
          handleCollapse={handleCollapse}
          updateLink={updateLink}
        />
        <ShowItemFields
          itemDetails={itemDetails}
          formConfig={formConfig}
          isCollapsed={isCollapsed}
          summaryViewFields={summaryViewFields}
        />
      </DzBox>
    </Flex>
  );
};
