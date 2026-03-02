import { DzBox } from '@/components/layout/v1';
import { FC, useEffect, useState } from 'react';
import { Translate } from '@/components/i18n';
import { Text } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { usePathname } from 'next/navigation';
import { ShowDetailsSectionFooterAction } from '../../../components/show-page/show-details-section-footer-actions';
import { ShowLineItemFields } from './show-line-item-fields';
import { ILineItem } from '../../lib/types';
import { ICampaign } from '../../../campaigns/lib/types';
import { Hideable } from '@/components/shared';
import { LeadValidationSettingsContainer } from '../lead-validation-settings';

export interface IShowItemFieldsProps {
  itemDetails?: ILineItem | ICampaign;
  formConfig: any;
  isCollapsed: boolean;
  summaryViewFields: string[];
}

export interface IShowLineItemDetailsProps extends IShowItemFieldsProps {
  updateUrl: string;
  stepCount: number;
  pageLabel: string;
  type: 'lineItem';
}

export const ShowLineItemDetails: FC<IShowLineItemDetailsProps> = ({
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
          marketerCode={itemDetails?.marketerCode}
          formConfig={formConfig}
          type={type}
          isCollapsed={isCollapsed}
          handleCollapse={handleCollapse}
          updateLink={updateLink}
        />
        <ShowLineItemFields
          itemDetails={itemDetails as ILineItem}
          formConfig={formConfig}
          isCollapsed={isCollapsed}
          summaryViewFields={summaryViewFields}
        />
        <Hideable
          show={
            !!(
              (
                type === 'lineItem' &&
                itemDetails?.id &&
                (itemDetails as ILineItem).validationSettingsId &&
                !isCollapsed
              ) // Only show when expanded
            )
          }>
          <LeadValidationSettingsContainer
            lineItemId={itemDetails?.id as string}
            leadValidationSettingId={
              (itemDetails as ILineItem)?.validationSettingsId
            }
          />
        </Hideable>
      </DzBox>
    </Flex>
  );
};
