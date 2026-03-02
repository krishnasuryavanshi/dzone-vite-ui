'use client';

import { Translate } from '@/components/i18n';
import { DzBox } from '@/components/layout/v1';
import { FormItem } from '@/uicomponents/form';
import { Select } from '@/uicomponents/form/input';
import { Flex } from '@/uicomponents/layout';
import { Col, Row } from '@/uicomponents/layout/grid';
import { Text } from '@/uicomponents/text';
import { FC, useEffect, useState } from 'react';
import { fetchLineItems } from '../../../../services';
import { useTemplateStore } from '../../../../stores';
import { DzRecord } from '@/lib/types';

interface SourceDetailSectionProps {
  templateId?: string;
}

export const SourceDetailSection: FC<SourceDetailSectionProps> = ({
  templateId,
}) => {
  const { updateTemplateData } = useTemplateStore();
  const [lineItemOptions, setLineItemOptions] = useState<
    {
      label: string;
      value: string;
      lineItemId?: string;
    }[]
  >([]);

  useEffect(() => {
    fetchLineItemOptions();
  }, []);

  const fetchLineItemOptions = async () => {
    try {
      const { data: items } = await fetchLineItems();
      const options = Array.isArray(items)
        ? items.map((item) => ({
            label: item.name,
            value: item.id,
            lineItemId: item.lineItemId,
          }))
        : [];
      setLineItemOptions(options);
    } catch (error) {
      setLineItemOptions([]);
    }
  };

  const renderLineItemOption = (option: DzRecord) => (
    <Flex vertical gap={0}>
      <Text ellipsis style={{ maxWidth: '100%' }}>
        {option.data.label}
      </Text>
      <Text style={{ color: '#888' }} text12>
        {option.data.lineItemId}
      </Text>
    </Flex>
  );

  const handleLineItemChange = (value: string) => {
    const selectedLineItem = lineItemOptions.find((opt) => opt.value === value);
    if (selectedLineItem) {
      updateTemplateData({
        lineItemId: value,
        lineItemName: selectedLineItem.label,
      });
    }
  };

  return (
    <DzBox dzOneBox style={{ marginBottom: '0.5rem' }}>
      <Text
        style={{
          fontWeight: '600',
        }}>
        Source Detail
      </Text>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <FormItem
            className='input-control form-control-item'
            name='lineItemId'
            label={
              <Text>
                <Translate i18nKey='pages.templates.label.lineItem' />
              </Text>
            }
            rules={[
              {
                required: true,
                message: 'Line Item selection is required',
              },
            ]}>
            <Select
              placeholder='Choose a Line Item'
              options={lineItemOptions}
              disabled={Boolean(templateId)}
              showSearch
              optionLabelProp='label'
              optionRender={renderLineItemOption}
              filterOption={(input, option) => {
                const searchTerm = input.toLowerCase();
                const label = (option?.label ?? '').toString().toLowerCase();
                const lineItemId = (option?.lineItemId ?? '')
                  .toString()
                  .toLowerCase();
                return (
                  label.includes(searchTerm) || lineItemId.includes(searchTerm)
                );
              }}
              onChange={handleLineItemChange}
            />
          </FormItem>
        </Col>
      </Row>
    </DzBox>
  );
};
