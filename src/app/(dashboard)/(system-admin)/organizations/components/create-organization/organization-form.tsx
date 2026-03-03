import React, { FC, useEffect, useState } from 'react';
import { IOrganization } from '../../lib/types';
import { useRouter } from '@/lib/hooks/use-router';
import { Form, FormItem, useForm, useWatch } from '@/uicomponents/form';
import {
  createOrganization,
  fetchOrganizationType,
  updateOrganization,
} from '../../services';
import { showNotification } from '@/services/index';
import { OrganizationFormActions } from './organization-form-actions';
import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { Col, Row } from '@/uicomponents/layout/grid';
import { Checkbox, Input, Radio, RadioGroup } from '@/uicomponents/form/input';
import './organization-form.scss';
import { Translate } from '@/components/i18n';

interface IOrganizationFormProps {
  isEditing?: boolean;
  organization?: IOrganization;
}

const MARKETER_TYPE_LABEL = 'Marketer';

export const OrganizationForm: FC<IOrganizationFormProps> = ({
  isEditing,
  organization,
}) => {
  const router = useRouter();
  const [organizationTypes, setOrganizationTypes] = useState<
    { label: string; value: string }[]
  >([]);
  const [form] = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOrganizationTypes();
  }, []);

  const orgTypeId = useWatch(['organizationTypeId'], form);

  const orgTypeLabel = organizationTypes.find(
    (type) => type.value === orgTypeId,
  )?.label;

  const isMarketerType = orgTypeLabel === MARKETER_TYPE_LABEL;

  useEffect(() => {
    if (isEditing && organization) {
      form.setFieldsValue({
        name: organization.name,
        businessDomain: organization.businessDomain,
        organizationTypeId: organization.organizationType?.id,
        managedByDigitalzone: organization.managedByDigitalzone,
        crmId: organization.crmId,
        financeId: organization.financeId,
      });
    }
  }, [organization]);

  const fetchOrganizationTypes = async () => {
    const { data } = await fetchOrganizationType();
    if (data?.length) {
      setOrganizationTypes(
        data.map((orgType: Record<string, string>) => ({
          label: orgType.name,
          value: orgType.id,
        })),
      );
    } else {
      setOrganizationTypes([]);
    }
  };

  const onFinish = async (values: IOrganization) => {
    setIsSubmitting(true);
    try {
      // format input values
      const formattedValues = values;

      if (isEditing && organization) {
        const data = await updateOrganization(
          formattedValues,
          organization.id as string,
        );
        showNotification({ message: data.message });
      } else {
        const data = await createOrganization({ ...formattedValues });
        if (data.message) {
          showNotification({ message: data.message });
        }
      }
      router.push('/organizations');
    } catch (error) {}
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    router.push('/organizations');
  };

  return (
    <DzBox dzOneBox style={{ height: '100%', padding: '2rem' }}>
      <Form
        form={form}
        style={{ height: '100%' }}
        layout='vertical'
        onFinish={onFinish}>
        <Flex
          gap='1rem'
          vertical
          justify='space-between'
          style={{ height: '100%' }}>
          <Flex vertical gap='1rem'>
            {!isEditing && (
              <DzBox>
                <Text strong>
                  Enter the required information to create organization
                </Text>
              </DzBox>
            )}
            <Row>
              <Col lg={8} md={16} sm={24} xs={24}>
                <Row gutter={16}>
                  <Col span={24}>
                    <FormItem
                      className='input-control form-control-item'
                      name='name'
                      label='Organization Name'
                      rules={[
                        { max: 150 },
                        { required: true, message: 'This field is required' },
                      ]}>
                      <Input
                        className='input-field'
                        placeholder='Enter Organization Name'
                        disabled={isEditing}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24}>
                    <FormItem
                      className='input-control form-control-item'
                      name='businessDomain'
                      label='Business Domain'
                      rules={[
                        { max: 150 },
                        { required: true, message: 'This field is required' },
                      ]}>
                      <Input
                        className='input-field'
                        placeholder='Enter Business Domain, e.g. Google.com'
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24}>
                    <FormItem
                      className='input-control form-control-item'
                      name='organizationTypeId'
                      label='Organization Type'
                      rules={[
                        { required: true, message: 'This field is required' },
                      ]}>
                      <RadioGroup>
                        {organizationTypes.map((orgType) => (
                          <Radio
                            key={orgType.value}
                            value={orgType.value}
                            disabled={isEditing}
                            className='organization-type'>
                            {' '}
                            {orgType.label}{' '}
                          </Radio>
                        ))}
                      </RadioGroup>
                    </FormItem>
                  </Col>
                </Row>
                {isMarketerType ? (
                  <Row gutter={16}>
                    <Col span={24}>
                      <FormItem
                        name='managedByDigitalzone'
                        valuePropName='checked'
                        style={{}}>
                        <Checkbox>
                          <Translate i18nKey='pages.organizations.label.managedByDigitalZone' />
                        </Checkbox>
                      </FormItem>
                    </Col>
                  </Row>
                ) : null}
                <Row gutter={16}>
                  <Col span={24}>
                    <FormItem
                      className='input-control form-control-item'
                      name='crmId'
                      label='CRM ID'
                      rules={[
                        {
                          required: isMarketerType,
                          message: 'This field is required',
                        },
                      ]}>
                      <Input
                        className='input-field'
                        placeholder='Enter CRM ID'
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24}>
                    <FormItem
                      className='input-control form-control-item'
                      name='financeId'
                      label='Finance ID'
                      rules={[
                        {
                          required: isMarketerType,
                          message: 'This field is required',
                        },
                      ]}>
                      <Input
                        className='input-field'
                        placeholder='Enter Finance ID'
                      />
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Flex>
          <DzBox>
            <OrganizationFormActions
              handleCancel={handleCancel}
              isEditing={isEditing}
              isSubmitting={isSubmitting}
            />
          </DzBox>
        </Flex>
      </Form>
    </DzBox>
  );
};
