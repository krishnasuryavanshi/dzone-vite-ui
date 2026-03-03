import { useOrganizationsByTypeQuery } from '@/app/(dashboard)/(system-admin)/organizations/hooks';
import { Translate } from '@/components/i18n';
import { Button, Form, FormItem, Modal, Title, useForm } from '@/uicomponents';
import { useSession } from '@/lib/hooks/use-session';
import { useRouter } from '@/lib/hooks/use-router';
import { FC, useMemo, useState } from 'react';
import { useValidationSettingStore } from '../../store';
import { Flex } from '@/uicomponents/layout';
import { Input, Select } from '@/uicomponents/form/input';
import { DZONE_CLR_BLACK } from '@/lib/constants';
import { Text } from '@/uicomponents';

const CreateNewValidationSettingLink = '/lead-validation-settings/create';

export const CreateNewValidationSettingAction: FC = () => {
  const router = useRouter();
  const { data: userData } = useSession();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const { setSettingMetadata, resetAll } = useValidationSettingStore();

  const [form] = useForm();

  const { data: orgData } = useOrganizationsByTypeQuery(
    'Marketer',
    (userData?.user as any)?.userId,
  );

  const marketerList = useMemo(
    () =>
      orgData?.data?.map(({ id, name: label, code }: any) => ({
        label,
        value: code,
      })) ?? [],
    [orgData],
  );

  const handleOpen = () => {
    form.resetFields();
    resetAll();
    setIsModalOpened(true);
  };

  const handleClose = () => {
    setIsModalOpened(false);
  };

  const handleStart = async () => {
    try {
      const values = await form.validateFields();
      setSettingMetadata({
        tenantCode: values.tenantCode,
        name: values.name,
      });
      setIsModalOpened(false);
      navigateToCreatePage();
    } catch (error) {}
  };

  const navigateToCreatePage = () => {
    router.push(CreateNewValidationSettingLink);
  };

  return (
    <>
      <Flex justify='space-between' align='center'>
        <Text
          style={{
            fontWeight: 600,
            paddingLeft: '0.5rem',
            paddingTop: '0.5rem',
            height: '2.25rem',
            color: DZONE_CLR_BLACK,
          }}>
          <Translate i18nKey='pages.leadValidationSettings.title' />
        </Text>
        <Button
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '0.3125rem',
            background:
              'linear-gradient(white, white) padding-box, linear-gradient(109deg, #FFB8EC 4.89%, #F3D6FF 51.39%, #7D88FF 97.01%) border-box',
            border: '1.5px solid transparent',
            height: '2.25rem',
            color: DZONE_CLR_BLACK,
          }}
          onClick={handleOpen}>
          <Translate i18nKey='pages.leadValidationSettings.label.createNew' />
        </Button>
      </Flex>
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
        <Form
          form={form}
          layout='vertical'
          onFinish={handleStart}
          initialValues={{ tenantCode: marketerList[0]?.value }}>
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
                style={{ height: '3rem' }}
                disabled={marketerList?.length === 1}
                placeholder='Select the Marketer'
                options={marketerList}
                showSearch
                optionFilterProp='label'
              />
            </FormItem>
          </Flex>
          <Flex gap='0.5rem' align='center' justify='flex-end'>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type='primary' htmlType='submit'>
              Start creating validation settings
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};
