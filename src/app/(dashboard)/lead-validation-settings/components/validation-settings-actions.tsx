import { Button } from '@/uicomponents/button';
import React, { useEffect, useMemo, useState } from 'react';
import { useValidationSettingStore } from '../store';
import { Form, FormItem, Modal, Title, useForm } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { Input, Select } from '@/uicomponents/form/input';
import { useOrganizationsByTypeQuery } from '../../(system-admin)/organizations/hooks';
import { useSession } from '@/lib/hooks/use-session';
import { useRouter } from '@/lib/hooks/use-router';
import { formatPayload, getNavigationUrl } from '../lib/utils';
import { DzRecord } from '@/lib/types';
import {
  createLeadValidationSetting,
  updateLineItemsLeadValidationSetting,
  updateMarketersLeadValidationSetting,
} from '../services';
import { showNotification } from '@/services/notification';
import { Hideable } from '@/components/shared';
import { useQueryState } from '@/lib/hooks/use-query-state';

export const ValidationSettingsActions = () => {
  const router = useRouter();
  const { data: userData } = useSession();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    isReadOnly,
    isEditing,
    settingMetadata,
    enabledRules,
    selectedValues,
    resetAll,
    leadValidationSettingConfig,
  } = useValidationSettingStore();

  const { queryState } = useQueryState();

  const [form] = useForm();

  const userId = (userData?.user as any)?.userId;
  const { data: orgsData } = useOrganizationsByTypeQuery('Marketer', userId);

  const marketerList = useMemo(() => {
    if (!orgsData?.data) return [];
    return orgsData.data.map(({ id, name: label, code }: any) => ({
      label,
      value: code,
    }));
  }, [orgsData]);

  useEffect(() => {
    form.setFieldsValue({
      name: settingMetadata?.name,
      tenantCode: settingMetadata?.tenantCode,
    });
  }, [isEditing, settingMetadata]);

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      await saveData(values);
    } catch (error) {}
  };

  const saveData = async (values: DzRecord) => {
    try {
      setLoading(true);
      const lineItemId = settingMetadata?.lineItemId;
      const res = formatPayload(
        values,
        enabledRules,
        selectedValues,
        leadValidationSettingConfig as Record<string, any>,
      );

      let result;
      if (isEditing) {
        if (lineItemId) {
          result = await updateLineItemsLeadValidationSetting(
            settingMetadata?.lineItemId as string,
            settingMetadata?.id as string,
            res,
          );
        } else {
          result = await updateMarketersLeadValidationSetting(
            settingMetadata?.tenantCode as string,
            settingMetadata?.id as string,
            res,
          );
        }
      } else {
        result = await createLeadValidationSetting(
          settingMetadata?.tenantCode as string,
          res,
        );
      }
      if (result?.message) {
        showNotification({
          type: 'success',
          message: result?.message,
        });
      }

      resetAll();
      setIsModalOpened(false);
      const redirectUrl = getNavigationUrl(
        lineItemId,
        queryState['redirectTo'],
      );
      router.push(redirectUrl);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async () => {
    if (!isEditing) {
      try {
        await saveData({
          name: settingMetadata?.name,
          tenantCode: settingMetadata?.tenantCode,
        });
      } catch (error) {}
    } else {
      setIsModalOpened(true);
    }
  };

  const handleClose = () => {
    setIsModalOpened(false);
  };

  return (
    <>
      <Hideable show={!isReadOnly}>
        <Button type='primary' onClick={handleOpen} loading={loading}>
          {isEditing ? 'Update Template' : 'Save and create template'}
        </Button>
      </Hideable>
      <Modal
        width={'30rem'}
        open={isModalOpened}
        onCancel={handleClose}
        maskClosable={false}
        title={
          <Title level={5} style={{ margin: 0 }}>
            Name the setting
          </Title>
        }
        footer={null}>
        <Form form={form} layout='vertical' onFinish={handleUpdate}>
          <Flex gap={'0.5rem'} vertical style={{ paddingBlock: '1rem' }}>
            <FormItem
              className='input-control form-control-item'
              name='name'
              label={null}
              rules={[
                { type: 'string' },
                { required: true, message: 'This field is required' },
                {
                  pattern: /^\S.*\S$|^\S$/,
                  message: 'No trailing spaces allowed',
                },
              ]}>
              <Input
                style={{ height: '3rem' }}
                placeholder='Enter the setting name'
              />
            </FormItem>
            <FormItem
              className='input-control form-control-item'
              name='tenantCode'
              label={null}
              rules={[{ required: true, message: 'This field is required' }]}>
              <Select
                disabled
                style={{ height: '3rem' }}
                placeholder='Select the Marketer'
                options={marketerList}
                showSearch
                optionFilterProp='label'
              />
            </FormItem>
          </Flex>
          <Flex gap='0.5rem' align='center' justify='flex-end'>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type='primary' htmlType='submit' loading={loading}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};
