import {
  REQUIRED_FIELD,
  ROLE_ALLOWED_SPECIAL_CHARACTERS,
  ROLE_DESCRIPTION_MAX_LENGTH,
  ROLE_NAME_MAX_LENGTH,
  ROLE_NAME_MIN_LENGTH,
} from '@/app/(dashboard)/campaign-management/lib/constants';
import { Translate } from '@/components/i18n';
import { CLR_GRAY_3 } from '@/lib/constants';
import { sanitizeText } from '@/lib/utils/string';
import { FormInstance, FormItem } from '@/uicomponents/form';
import { Input, Select, TextArea } from '@/uicomponents/form/input';
import { Flex, Space } from '@/uicomponents/layout';
import { Col, Row } from '@/uicomponents/layout/grid';
import { FC, useState } from 'react';
import { useEditStore } from '../../stores';
import { showNotification } from '@/services/notification';
import { StatusChangeModal } from '../modals';
import { IRoleDetails } from '../../lib/types';
import { StatusOptions } from '../../lib/constants';
import { Status } from '../../lib/enums';
import { TenantType } from '../../../../components';

interface IBasicDetailsFormProps {
  form: FormInstance<any>;
  roleDetails: IRoleDetails;
}

export const BasicDetailsForm: FC<IBasicDetailsFormProps> = ({
  form,
  roleDetails,
}) => {
  const { isEditAllowed } = useEditStore();
  const [isStatusChanging, setIsStatusChanging] = useState(false);
  const [newStatus, setNewStatus] = useState<string | null>(null);

  const handleStatusChange = (value: string) => {
    setNewStatus(value);
    if (
      value === Status.INACTIVE &&
      roleDetails?.status?.name === Status.ACTIVE
    ) {
      setIsStatusChanging(true);
    } else {
      form.setFieldsValue({ status: value });
      showNotification({ message: 'Status updated successfully!' });
    }
  };

  const handleProceedStatusChange = () => {
    if (newStatus) {
      form.setFieldsValue({ status: newStatus });
      showNotification({ message: 'Status updated successfully!' });
    }
    setIsStatusChanging(false);
  };

  const handleCancel = () => {
    form.setFieldsValue({ status: roleDetails?.status });
    setIsStatusChanging(false);
  };

  const getStatusOptions = () => {
    const currentStatus = roleDetails?.status?.name;
    if (currentStatus === Status.ACTIVE) {
      return StatusOptions.filter(
        (option) => option.value === Status.INACTIVE,
      ).map((option) => ({
        value: option.value,
        label: option.label,
      }));
    } else if (currentStatus === Status.INACTIVE) {
      return StatusOptions.filter(
        (option) => option.value === Status.ACTIVE,
      ).map((option) => ({
        value: option.value,
        label: option.label,
      }));
    }
    return StatusOptions.map((option) => ({
      value: option.value,
      label: option.label,
    }));
  };

  return (
    <>
      <Flex vertical>
        <Space
          style={{
            marginBottom: '0.75rem',
            fontWeight: 600,
            color: CLR_GRAY_3,
          }}>
          <Translate i18nKey='pages.rolesAndPermissions.label.basicDetails' />
        </Space>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <FormItem
              className='input-control form-control-item'
              name='name'
              label={
                <Translate i18nKey='pages.rolesAndPermissions.label.roleName' />
              }
              rules={[
                { type: 'string' },
                { required: true, message: REQUIRED_FIELD },
                {
                  pattern: /^[A-Za-z0-9-_ ]+$/,
                  message: ROLE_ALLOWED_SPECIAL_CHARACTERS,
                },
                {
                  validator: (_, value) => {
                    if (value && value.length < 3) {
                      return Promise.reject(new Error(ROLE_NAME_MIN_LENGTH));
                    } else if (value && value.length > 50) {
                      return Promise.reject(new Error(ROLE_NAME_MAX_LENGTH));
                    }
                    return Promise.resolve();
                  },
                },
              ]}>
              <Input
                className='input-field'
                placeholder='Enter role name'
                disabled={!isEditAllowed && Boolean(roleDetails?.id)}
                onBlur={(event: any) => {
                  const value = event.target.value;
                  let sanitizedValue = sanitizeText(value);
                  form.setFieldsValue({ name: sanitizedValue });
                }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              className='input-control form-control-item'
              name='description'
              label={
                <Translate i18nKey='pages.rolesAndPermissions.label.description' />
              }
              rules={[
                { type: 'string' },
                { max: 500, message: ROLE_DESCRIPTION_MAX_LENGTH },
              ]}>
              <TextArea
                className='input-field'
                placeholder='Enter role description'
                style={{
                  width: '100%',
                  minHeight: '3rem',
                  height: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  lineHeight: 'normal',
                  paddingTop: '0.75rem',
                }}
                autoSize={false}
                disabled={!isEditAllowed && Boolean(roleDetails?.id)}
                onBlur={(event) => {
                  const inputValue = event.target.value;
                  const textWithPlaceholders = inputValue.replace(
                    /(\r\n|\n)/g,
                    '___LINEBREAK___',
                  );
                  const sanitizedText = sanitizeText(textWithPlaceholders);
                  const finalText = sanitizedText.replace(
                    /___LINEBREAK___/g,
                    '\n',
                  );
                  form.setFieldsValue({ description: finalText });
                }}
              />
            </FormItem>
          </Col>
          {roleDetails?.id && (
            <Col span={8}>
              <FormItem
                name='status'
                label={
                  <Translate i18nKey='pages.rolesAndPermissions.label.status' />
                }
                className='input-control form-control-input'>
                <Select
                  size={'large'}
                  defaultValue={newStatus || 'Select Status'}
                  className='select'
                  disabled={!isEditAllowed && Boolean(roleDetails?.id)}
                  onChange={(value) => handleStatusChange(value)}
                  options={getStatusOptions()}
                />
              </FormItem>
            </Col>
          )}
        </Row>
        <TenantType
          isDisabled={!isEditAllowed && Boolean(roleDetails?.id)}
          isRole={true}
        />
      </Flex>
      <StatusChangeModal
        show={isStatusChanging}
        handleProceedStatusChange={handleProceedStatusChange}
        handleCancel={handleCancel}
      />
    </>
  );
};
