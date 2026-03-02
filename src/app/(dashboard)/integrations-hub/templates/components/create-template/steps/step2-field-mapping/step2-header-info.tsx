'use client';

import { DzBox } from '@/components/layout/v1';
import { Hideable } from '@/components/shared';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { FC } from 'react';
import { useTemplateStore } from '../../../../stores';

export const Step2HeaderInfo: FC = () => {
  const { updatedTemplateData } = useTemplateStore();

  const templateName = updatedTemplateData?.name || '-';
  const deliveryType = updatedTemplateData?.deliveryType || '-';
  const integrationName = updatedTemplateData?.integrationName || '';
  const deliveryObject = updatedTemplateData?.deliveryObject?.name || '';
  const sourceType = updatedTemplateData?.type || '';

  // Show Source Type only for Zapier
  const showSourceType = deliveryType === 'Zapier';

  // Show Integration Name for HubSpot, WebForm, Zapier
  const showIntegrationName =
    deliveryType === 'HubSpot' ||
    deliveryType === 'WebForm' ||
    deliveryType === 'Zapier' ||
    deliveryType === 'FTP';

  // Show Delivery Object only for HubSpot
  const showDeliveryObject = deliveryType === 'HubSpot';

  const labelStyle = {
    fontSize: '0.75rem',
    color: '#8c8c8c',
    display: 'block',
    marginBottom: '0.25rem',
  };

  const valueStyle = {
    fontSize: '0.875rem',
    fontWeight: 500,
  };

  const dividerStyle = {
    borderLeft: '1px solid #e8e8e8',
    paddingLeft: '1.5rem',
  };

  return (
    <DzBox
      className='dz-page-content'
      dzOneBox
      style={{
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: '#fafafa',
        borderRadius: '6px',
      }}>
      <Flex gap='1.5rem'>
        {/* Template Name - Always shown */}
        <div>
          <Text style={labelStyle}>Template Name</Text>
          <Text style={valueStyle}>{templateName}</Text>
        </div>

        {/* Delivery Type - Always shown */}
        <div style={dividerStyle}>
          <Text style={labelStyle}>Delivery Type</Text>
          <Text style={valueStyle}>{deliveryType}</Text>
        </div>

        {/* Source Type - Shown only for Zapier */}
        <Hideable show={showSourceType}>
          <div style={dividerStyle}>
            <Text style={labelStyle}>Source Type</Text>
            <Text style={valueStyle}>{sourceType || '-'}</Text>
          </div>
        </Hideable>

        {/* Integration Name - Shown for HubSpot, WebForm, Zapier */}
        <Hideable show={showIntegrationName}>
          <div style={dividerStyle}>
            <Text style={labelStyle}>Integration Name</Text>
            <Text style={valueStyle}>{integrationName || '-'}</Text>
          </div>
        </Hideable>

        {/* Delivery Object - Shown only for HubSpot */}
        <Hideable show={showDeliveryObject}>
          <div style={dividerStyle}>
            <Text style={labelStyle}>Delivery Object</Text>
            <Text style={valueStyle}>{deliveryObject || '-'}</Text>
          </div>
        </Hideable>
      </Flex>
    </DzBox>
  );
};
