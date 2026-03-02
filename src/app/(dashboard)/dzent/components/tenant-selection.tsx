import { DzRecord } from '@/lib/types';
import { Form, FormItem, useForm } from '@/uicomponents/form';
import { Button, Modal, Title } from '@/uicomponents/index';
import { useEffect, useState } from 'react';
import { fetchOrganizationsByType } from '../../(system-admin)/organizations/services';
import { Flex } from '@/uicomponents/layout';
import { Select } from '@/uicomponents/form/input';
import { useDzentStore } from '../store';

type TenantSelectionProps = {
  userId?: string;
};

export const TenantSelection = ({ userId }: TenantSelectionProps) => {
  const { setTenantCode, setMarketerList } = useDzentStore();
  const [marketerList, setMarketerListState] = useState<DzRecord[]>([]);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [form] = useForm();

  useEffect(() => {
    fetchMarketerList();
    setIsModalOpened(true);
  }, []);

  const fetchMarketerList = async () => {
    try {
      const { data } = await fetchOrganizationsByType('Marketer', userId);
      const marketers = data?.map(({ id, name: label, code }: DzRecord) => ({
        label,
        value: code,
      }));
      setMarketerListState(marketers || []);
      setMarketerList(marketers);
    } catch (error) {}
  };

  const handleStart = async () => {
    try {
      const values = await form.validateFields();
      setIsModalOpened(false);
      setTenantCode(values.tenantCode);
    } catch (error) {}
  };

  return (
    <Modal
      width={'30rem'}
      open={isModalOpened}
      maskClosable={false}
      onCancel={() => setTenantCode(marketerList[0]?.value)}
      title={
        <Title level={5} style={{ margin: 0 }}>
          Select Marketer
        </Title>
      }
      footer={null}>
      <Form form={form} layout='vertical' onFinish={handleStart}>
        <Flex gap={'0.5rem'} vertical style={{ paddingBlock: '1rem' }}>
          <FormItem
            className='input-control form-control-item'
            name='tenantCode'
            label={null}
            rules={[{ required: true, message: 'This field is required' }]}>
            <Select
              style={{ height: '3rem' }}
              placeholder='Select the Marketer'
              options={marketerList as any}
              showSearch
              optionFilterProp='label'
            />
          </FormItem>
        </Flex>
        <Flex gap='0.5rem' align='center' justify='flex-end'>
          <Button type='primary' htmlType='submit'>
            Go
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};
