import { PreviewLink } from '@/app/(dashboard)/integrations-hub/templates/components/create-template/preview-link';
import React, { FC, useEffect, useState } from 'react';
import { DeliveryType } from '@/app/(dashboard)/integrations-hub/templates/lib/enums';
import { Text } from '@/uicomponents';
import { Drawer } from '@/uicomponents/drawers';
import { DrawerCloseButton } from '@/app/(dashboard)/components';
import { DzBox } from '@/components/layout/v1';
import { Form, FormItem, useForm } from '@/uicomponents/form';
import { Button } from '@/uicomponents/button';
import { Select } from '@/uicomponents/form/input';
import { Row, Col } from '@/uicomponents/layout/grid';
import { Flex, Space } from '@/uicomponents/layout';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import { showNotification } from '@/services';
import {
  createDeliverySchedule,
  updateDeliverySchedule,
  DeliveryTemplateType,
  DeliveryTemplate,
  DeliverySchedule,
} from '../../services';
import { DELIVERY_FREQUENCY_OPTIONS, WEEK_DAYS } from '../../lib/constants';
import { DayPicker } from './day-picker';
import {
  useDeliveryTemplateTypesQuery,
  useDeliveryTemplateListQuery,
} from '../../hooks';

interface IScheduleDeliveryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lineItemId: string;
  onScheduleCreated?: () => void;
  editSchedule?: DeliverySchedule | null;
}

interface IScheduleDeliveryFormData {
  deliveryType: DeliveryType;
  deliveryFormat?: 'CSV' | 'Excel';
  deliveryTemplateId: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'RealTime';
  deliveryDay?: number; // 1-7 for Weekly
  deliveryDate?: number; // 1-31 for Monthly
  time?: string;
  period?: 'AM' | 'PM';
}

export const ScheduleDeliveryDrawer: FC<IScheduleDeliveryDrawerProps> = ({
  isOpen,
  onClose,
  lineItemId,
  onScheduleCreated,
  editSchedule,
}) => {
  const [form] = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(
    DeliveryType.FLAT_FILE,
  );
  const [frequency, setFrequency] = useState<
    'Daily' | 'Weekly' | 'Monthly' | 'RealTime'
  >('Daily');

  // Queries
  const { data: templateTypesResponse } = useDeliveryTemplateTypesQuery(isOpen);
  const deliveryTemplateTypes: DeliveryTemplateType[] =
    (templateTypesResponse as any)?.data?.data ?? [];

  const { data: templateListResponse, isFetching: loadingTemplates } =
    useDeliveryTemplateListQuery(deliveryType, isOpen && !!deliveryType);
  const deliveryTemplates: DeliveryTemplate[] =
    templateListResponse?.data ?? [];

  // Dynamic options based on API data
  const deliveryTypeOptions = Array.isArray(deliveryTemplateTypes)
    ? deliveryTemplateTypes.map((type) => ({
        label:
          type.deliveryType === DeliveryType.FLAT_FILE
            ? 'Flat File'
            : type.deliveryType,
        value: type.deliveryType,
      }))
    : [];

  const selectedTemplateType = Array.isArray(deliveryTemplateTypes)
    ? deliveryTemplateTypes.find((type) => type.deliveryType === deliveryType)
    : undefined;
  const deliveryFormatOptions =
    selectedTemplateType?.deliveryFormat?.map((format) => ({
      label: format,
      value: format,
    })) || [];

  // Dynamic delivery template options based on API data
  const deliveryTemplateOptions = deliveryTemplates.map((template) => ({
    label: template.name,
    value: template.id,
    integrationId: template.integrationId || '', // always provide integrationId if present
  }));

  // Auto-select template when templates load
  useEffect(() => {
    if (!deliveryTemplates.length || !isOpen) return;
    if (editSchedule && editSchedule.deliveryType === deliveryType) {
      const templateId = editSchedule.deliveryTemplateId;
      if (
        templateId &&
        deliveryTemplates.some((template) => template.id === templateId)
      ) {
        form.setFieldsValue({ deliveryTemplateId: templateId });
      } else {
        form.setFieldsValue({ deliveryTemplateId: deliveryTemplates[0].id });
      }
    } else {
      form.setFieldsValue({ deliveryTemplateId: deliveryTemplates[0].id });
    }
  }, [deliveryTemplates, isOpen]);

  useEffect(() => {
    if (isOpen) {
      form.resetFields();

      if (editSchedule) {
        // Edit mode - populate form with existing data
        const initialType = editSchedule.deliveryType;
        setDeliveryType(initialType);
        setFrequency(editSchedule.frequency);

        // Parse time if exists
        let timeValue = null;
        if (editSchedule.deliveryTime) {
          const [time, period] = editSchedule.deliveryTime.split(' ');
          const [hours, minutes] = time.split(':');
          const hour24 =
            period === 'PM' && hours !== '12'
              ? parseInt(hours) + 12
              : period === 'AM' && hours === '12'
                ? 0
                : parseInt(hours);
          timeValue = dayjs().hour(hour24).minute(parseInt(minutes));
        }

        form.setFieldsValue({
          deliveryType: initialType,
          deliveryFormat: editSchedule.deliveryFormat,
          frequency: editSchedule.frequency,
          deliveryDay: editSchedule.deliveryDay,
          deliveryDate: editSchedule.deliveryDate,
          time: timeValue,
        });
      } else {
        // Create mode - set defaults
        form.setFieldsValue({
          deliveryType: DeliveryType.FLAT_FILE,
          frequency: 'Daily',
        });
        setDeliveryType(DeliveryType.FLAT_FILE);
        setFrequency('Daily');
      }
    }
  }, [isOpen, form, editSchedule]);

  const handleDeliveryTypeChange = (value: DeliveryType) => {
    setDeliveryType(value);
    form.setFieldsValue({
      deliveryFormat: undefined,
      deliveryTemplateId: undefined,
    });
    // Templates will be loaded automatically via query key change
  };

  const handleFrequencyChange = (
    value: 'Daily' | 'Weekly' | 'Monthly' | 'RealTime',
  ) => {
    setFrequency(value);
    form.setFieldsValue({
      deliveryDay: undefined,
      deliveryDate: undefined,
      time: undefined,
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);

      const payload: any = {
        deliveryType: values.deliveryType,
        deliveryFormat:
          values.deliveryType === DeliveryType.FLAT_FILE
            ? values.deliveryFormat
            : null,
        deliveryTemplateId: values.deliveryTemplateId,
        frequency: values.frequency,
        deliveryDay: values.frequency === 'Weekly' ? values.deliveryDay : null,
        deliveryDate:
          values.frequency === 'Monthly' ? values.deliveryDate : null,
        deliveryTime:
          values.frequency !== 'RealTime' && values.time
            ? values.time.format('h:mm A')
            : null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      let success = false;

      if (editSchedule) {
        // Update existing schedule
        const updateResponse = await updateDeliverySchedule(
          editSchedule.id,
          payload,
        );
        success = !!updateResponse;
      } else {
        // Create new schedule
        payload.lineItemId = lineItemId;
        const createResponse = await createDeliverySchedule(payload);
        success = !!createResponse?.data;
      }

      if (success) {
        showNotification({
          type: 'success',
          message: editSchedule
            ? 'Delivery schedule updated successfully'
            : 'Delivery schedule created successfully',
        });
        onScheduleCreated?.();
        onClose();
      }
    } catch (error) {
      // Error is handled by authenticatedRequest
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTimeFields = () => {
    if (frequency === 'RealTime') return null;

    return (
      <>
        {frequency === 'Weekly' && (
          <Col span={24}>
            <FormItem
              label='Delivery Day'
              name='deliveryDay'
              rules={[
                { required: true, message: 'Please select delivery day' },
              ]}
              className='input-control form-control-item'>
              <Select
                placeholder='Select day'
                options={WEEK_DAYS}
                style={{ width: '100%' }}
              />
            </FormItem>
          </Col>
        )}
        {frequency === 'Monthly' && (
          <Col span={24}>
            <FormItem
              label='Delivery Date'
              name='deliveryDate'
              rules={[
                { required: true, message: 'Please select delivery date' },
              ]}
              className='input-control form-control-item'>
              <DayPicker
                placeholder='Select date'
                style={{ width: '100%' }}
                className='input-field'
              />
            </FormItem>
          </Col>
        )}
        <Col span={24}>
          <FormItem
            label='Time'
            name='time'
            rules={[{ required: true, message: 'Please select time' }]}
            className='input-control form-control-item'>
            <TimePicker
              use12Hours
              showNow={false}
              format='h:mm A'
              placeholder='00:00 AM'
              className='input-field'
              style={{ width: '100%' }}
            />
          </FormItem>
        </Col>
      </>
    );
  };

  return (
    <Drawer
      title={editSchedule ? 'Edit Delivery Schedule' : 'Schedule Delivery'}
      onClose={onClose}
      open={isOpen}
      closable
      maskClosable={false}
      placement='right'
      closeIcon={<DrawerCloseButton />}
      destroyOnClose
      width='30rem'>
      <DzBox>
        <Form form={form} onFinish={handleSubmit} layout='vertical'>
          <Row gutter={16}>
            <Col span={24}>
              <FormItem
                label='Delivery Type'
                name='deliveryType'
                rules={[
                  { required: true, message: 'Please select delivery type' },
                ]}
                className='input-control form-control-item'>
                <Select
                  placeholder='Select Delivery Type'
                  options={deliveryTypeOptions}
                  onChange={handleDeliveryTypeChange}
                  style={{ width: '100%' }}
                />
              </FormItem>
            </Col>

            {deliveryType === DeliveryType.FLAT_FILE &&
              selectedTemplateType?.deliveryFormat && (
                <Col span={24}>
                  <FormItem
                    label='Delivery Format'
                    name='deliveryFormat'
                    rules={[
                      {
                        required: true,
                        message: 'Please select delivery format',
                      },
                    ]}
                    className='input-control form-control-item'>
                    <Select
                      placeholder='Select Format'
                      options={deliveryFormatOptions}
                      style={{ width: '100%' }}
                    />
                  </FormItem>
                </Col>
              )}
            <Col span={24}>
              <FormItem
                label={
                  <Space
                    style={{
                      width: '100%',
                      position: 'relative',
                      columnGap: '0',
                    }}>
                    <Text>Delivery Template</Text>
                    {(deliveryType === DeliveryType.WEBFORM ||
                      deliveryType === DeliveryType.ZAPIER) && (
                      <PreviewLink
                        integrationId={(() => {
                          const selectedId =
                            form.getFieldValue('deliveryTemplateId');
                          const selectedTemplate = deliveryTemplates.find(
                            (t) => t.id === selectedId,
                          );
                          return selectedTemplate?.integrationId || '';
                        })()}
                        style={{
                          position: 'absolute',
                          left: '23rem',
                          width: '100%',
                          top: '1px',
                        }}
                      />
                    )}
                  </Space>
                }
                name='deliveryTemplateId'
                rules={[
                  {
                    required: true,
                    message: 'Please select delivery template',
                  },
                ]}
                className='input-control form-control-item'>
                <Select
                  placeholder={
                    loadingTemplates
                      ? 'Loading templates...'
                      : 'Select Template'
                  }
                  options={deliveryTemplateOptions}
                  loading={loadingTemplates}
                  disabled={loadingTemplates}
                  style={{ width: '100%' }}
                />
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem
                label='Frequency'
                name='frequency'
                rules={[{ required: true, message: 'Please select frequency' }]}
                className='input-control form-control-item'>
                <Select
                  placeholder='Select Frequency'
                  options={DELIVERY_FREQUENCY_OPTIONS}
                  onChange={handleFrequencyChange}
                  style={{ width: '100%' }}
                />
              </FormItem>
            </Col>

            {renderTimeFields()}
          </Row>

          <Flex justify='end' gap='0.5rem' style={{ marginTop: '2rem' }}>
            <Button onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type='primary' htmlType='submit' loading={isSubmitting}>
              {editSchedule ? 'Update' : 'Schedule'}
            </Button>
          </Flex>
        </Form>
      </DzBox>
    </Drawer>
  );
};
