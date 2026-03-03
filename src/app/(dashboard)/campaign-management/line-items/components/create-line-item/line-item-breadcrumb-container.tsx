import React, { FC } from 'react';
import { Translate } from '@/components/i18n';
import { Flex } from 'antd';
import {
  ICreateLineItemBreadcrumbsProps,
  LineItemBreadcrumbs,
} from './line-item-breadcrumbs';
import { ArrowLeft } from '@/uicomponents/icons/svgs';
import { DZONE_CLR_GRAY_DARK } from '@/lib/constants';
import { Link } from 'react-router';

interface LineItemBreadCrumbContainer extends ICreateLineItemBreadcrumbsProps {}

export const LineItemBreadCrumbContainer: FC<LineItemBreadCrumbContainer> = ({
  campaignData,
  id,
  lineItemId,
}) => {
  return (
    <Flex
      vertical
      gap='0.5rem'
      style={{ padding: '0.5rem', paddingBottom: '0rem' }}>
      <LineItemBreadcrumbs {...{ campaignData, id, lineItemId }} />
      <Flex gap='0.5rem' align='center'>
        <Link to='/campaign-management/line-items'>
          <Flex
            align='center'
            justify='center'
            style={{
              borderRadius: '1rem',
              background: DZONE_CLR_GRAY_DARK,
              height: '1.5rem',
              width: '1.5rem',
              cursor: 'pointer',
              paddingTop: '0.25rem',
            }}>
            <ArrowLeft />
          </Flex>
        </Link>
        {id ? (
          <strong>
            <Translate i18nKey='form.editLineItem.edit' />
          </strong>
        ) : (
          <strong>
            <Translate i18nKey='form.createLineItem.create' />
          </strong>
        )}
      </Flex>
    </Flex>
  );
};
