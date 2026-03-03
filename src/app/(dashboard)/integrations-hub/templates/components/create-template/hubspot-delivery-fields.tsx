
import { FC } from 'react';
import { FormItem, FormInstance } from '@/uicomponents/form';
import { Select } from '@/uicomponents/form/input';
import { Col } from '@/uicomponents/layout/grid';
import { Text } from '@/uicomponents';
import { Translate } from '@/components/i18n';
import { BlueTickIcon } from '@/uicomponents/icons';
import { REQUIRED_FIELD } from '@/app/(dashboard)/campaign-management/lib/constants';
import { Flex, Space } from '@/uicomponents/layout';

interface HubSpotDeliveryFieldsProps {
  form: FormInstance;
  templateId?: string;
  isEditTemplateAllowed: boolean;
  deliveryObjectOptions: {
    label: string;
    value: string;
    id: string;
    name: string;
    fieldCount: any;
  }[];
  deliveryType: string;
  updateTemplateData: (data: any) => void;
  fetchFormFieldsData: (
    deliveryType: string,
    integrationId: string,
    objectId: string,
  ) => void;
}

export const HubSpotDeliveryFields: FC<HubSpotDeliveryFieldsProps> = ({
  form,
  templateId,
  isEditTemplateAllowed,
  deliveryObjectOptions,
  deliveryType,
  updateTemplateData,
  fetchFormFieldsData,
}) => {
  return (
    <Col span={8}>
      <FormItem
        className='input-control form-control-item'
        name='selectedDeliveryObjectId'
        label={
          <Text>
            {' '}
            <Translate i18nKey='pages.templates.label.deliveryObject' />
          </Text>
        }
        rules={[{ required: true, message: REQUIRED_FIELD }]}>
        <Select
          placeholder='Select an Object'
          style={{ width: '100%' }}
          optionLabelProp='label'
          onChange={(value) => {
            // Set the selected delivery object ID in form
            form.setFieldsValue({
              selectedDeliveryObjectId: value,
            });

            // Find the selected object details and update context immediately
            const selectedObject = deliveryObjectOptions.find(
              (opt) => opt.value === value,
            );

            if (selectedObject) {
              const deliveryObjectData = {
                id: selectedObject.id,
                name: selectedObject.name,
              };

              updateTemplateData({
                deliveryObject: deliveryObjectData,
              });

              // Fetch form fields for the selected delivery object
              if (deliveryType && form.getFieldValue('integrationId')) {
                fetchFormFieldsData(
                  deliveryType,
                  form.getFieldValue('integrationId'),
                  value,
                );
              }
            }
          }}
          disabled={Boolean(templateId && !isEditTemplateAllowed)}>
          {deliveryObjectOptions.map((option) => (
            <Select.Option
              key={option.value}
              value={option.value}
              label={option.name}>
              <Flex
                justify='space-between'
                align='center'
                style={{ width: '100%', padding: '4px 0' }}>
                <Space direction='vertical' size={0}>
                  <Text style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                    {option.name}
                  </Text>
                  <Text
                    type='secondary'
                    style={{ fontSize: '0.75rem', fontWeight: 400 }}>
                    {option.fieldCount}{' '}
                    {option.fieldCount === 1 ? 'Field' : 'Fields'}
                  </Text>
                </Space>
                {form.getFieldValue('selectedDeliveryObjectId') ===
                  option.value && <BlueTickIcon size={16} color='#1890ff' />}
              </Flex>
            </Select.Option>
          ))}
        </Select>
      </FormItem>
    </Col>
  );
};
