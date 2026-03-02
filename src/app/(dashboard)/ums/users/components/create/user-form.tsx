import { IOrganization } from '@/app/(dashboard)/(system-admin)/organizations/lib/types';
import { fetchOrganizationsByType } from '@/app/(dashboard)/(system-admin)/organizations/services';
import { DzBox } from '@/components/layout/v1';
import { CLR_GRAY_6 } from '@/lib/constants';
import { showNotification } from '@/services/notification';
import { Divider, Image, Text, Title } from '@/uicomponents';
import { Form, FormItem, useForm } from '@/uicomponents/form';
import { Checkbox, Input, Select } from '@/uicomponents/form/input';
import { Flex, Space } from '@/uicomponents/layout';
import { Col, Row } from '@/uicomponents/layout/grid';
import { Modal } from '@/uicomponents/modal';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTenantTypeStore } from '@/stores/tenant-store';
import { TenantType } from '../../../../components';
import { fetchRolesByType } from '../../../roles/services/fetch-roles-by-type';
import { TenantTypeEnum } from '../../lib/enums';
import { IUser, IUserRole } from '../../lib/types';
import { createUser, updateUser } from '../../services';
import { UserFormActions } from './user-form-actions';
import './user-form-select.module.css';

interface IUserFormProps {
  isEditing?: boolean;
  user?: IUser;
}

export const UserForm: FC<IUserFormProps> = ({ isEditing, user }) => {
  const router = useRouter();
  const [roles, setRoles] = useState<{ label: string; value: string }[]>([]);
  const [form] = useForm();
  const [openEmailSentModal, setOpenEmailSentModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdUser, setCreatedUser] = useState<IUser | null>(null);
  const { tenantTypes, fetchTenantTypes } = useTenantTypeStore();
  const [tenantType, setTenantType] = useState<string>('');
  const [isMarketer, setIsMarketer] = useState<boolean>(false);
  const [isSupplier, setIsSupplier] = useState<boolean>(false);
  const [isDzoneUser, setIsDzoneUser] = useState<boolean>(false);
  const [organizationsList, setOrganizationsList] = useState<
    { label: string; value: string; managedByDigitalzone?: boolean }[]
  >([]);
  const [assignAllManagedOrgs, setAssignAllManagedOrgs] =
    useState<boolean>(false);
  const [rawOrganizations, setRawOrganizations] = useState<IOrganization[]>([]);

  useEffect(() => {
    fetchTenantTypes();
  }, []);

  useEffect(() => {
    if (isEditing && user) {
      // Get all org ids from user
      let orgIds = user.organizations
        .map((org: IOrganization) => org.id)
        .filter((id): id is string => id !== undefined);
      // Get all managed org ids from user.organizations
      const managedOrgIds = user.organizations
        .filter((org: IOrganization) => org.managedByDigitalzone)
        .map((org: IOrganization) => org.id)
        .filter((id): id is string => id !== undefined);
      // If not all managed orgs are in orgIds, add them
      orgIds = Array.from(new Set([...orgIds, ...managedOrgIds]));
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        type: user.type,
        isDzoneUser: user.isDzoneUser,
        organizations: orgIds,
        roles: user.roles.map((role: IUserRole) => role.id),
      });
      setIsMarketer(user.type === TenantTypeEnum.MARKETER);
      setIsSupplier(user.type === TenantTypeEnum.SUPPLIER);
      setIsDzoneUser(user.isDzoneUser);
      setAssignAllManagedOrgs(user.autoAssignMarketers);
      form.setFieldValue('autoAssignMarketers', user.autoAssignMarketers);
    }
  }, [user, isEditing]);

  useEffect(() => {
    if (tenantType || user?.type) {
      fetchRoles(tenantType || user?.type!);
      fetchOrgs(tenantType || user?.type!);
      if ((tenantType || user?.type) === TenantTypeEnum.SUPPLIER) {
        setIsDzoneUser(false);
        form.setFieldValue('isDzoneUser', false);
      }
    }
  }, [tenantType, user?.type]);

  const onValuesChange = (changedValues: any) => {
    if (changedValues.type) {
      form.setFieldValue('roles', []);
      form.setFieldValue('organizations', []);
      setTenantType(changedValues.type);
      setIsMarketer(changedValues.type === TenantTypeEnum.MARKETER);
      setIsSupplier(changedValues.type === TenantTypeEnum.SUPPLIER);

      // For Suppliers, always disable isDzoneUser
      if (changedValues.type === TenantTypeEnum.SUPPLIER) {
        setIsDzoneUser(false);
        form.setFieldValue('isDzoneUser', false);
      }
    }
    if (changedValues.isDzoneUser !== undefined) {
      setIsDzoneUser(changedValues.isDzoneUser);
      if (!changedValues.isDzoneUser) {
        form.setFieldValue('organizations', []);
        setAssignAllManagedOrgs(false);
      }
    }
    if (changedValues.assignAllManagedOrgs !== undefined) {
      handleAssignAllManagedOrgsChange(changedValues.assignAllManagedOrgs);
    }
  };

  const fetchRoles = async (tenantType: string) => {
    const { data } = await fetchRolesByType(tenantType);
    if (data?.length) {
      setRoles(
        data.map((role: IUserRole) => ({
          label: role.name,
          value: role.id,
        })),
      );
    } else {
      setRoles([]);
    }
  };

  const fetchOrgs = async (tenantType: string) => {
    const { data } = await fetchOrganizationsByType(tenantType);
    if (data?.length) {
      setRawOrganizations(data);
      setOrganizationsList(
        data?.map((organization: IOrganization) => ({
          label: organization.name,
          value: organization.id,
          managedByDigitalzone: organization.managedByDigitalzone,
        })),
      );
    } else {
      setRawOrganizations([]);
      setOrganizationsList([]);
    }
  };

  const onFinish = async (values: IUser) => {
    if (!Array.isArray(values.organizations)) {
      values.organizations = [values.organizations];
    }
    setIsSubmitting(true);
    try {
      if (isEditing && user) {
        const data = await updateUser(values, user.email);
        showNotification({ message: data.message });
        router.push('/ums/users');
      } else {
        const data = await createUser({ ...values, editable: true });
        if (data?.data) {
          setCreatedUser(data.data);
        }
        if (data.message) {
          showNotification({ message: data.message });
        }
        setOpenEmailSentModal(true);
      }
    } catch (error) {}
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setOpenEmailSentModal(false);
    router.push('/ums/users');
  };

  const handleFilterOption = (input: string, option: any) => {
    return (option?.label || '').toLowerCase().includes(input.toLowerCase());
  };

  const handleAssignAllManagedOrgsChange = (checked: boolean) => {
    setAssignAllManagedOrgs(checked);
    const managedOrgIds = rawOrganizations
      .filter((org) => org.managedByDigitalzone)
      .map((org) => org.id)
      .filter((id): id is string => id !== undefined);
    const currentOrgs = form.getFieldValue('organizations') || [];

    if (checked) {
      const newOrgs = Array.from(new Set([...currentOrgs, ...managedOrgIds]));
      form.setFieldValue('organizations', newOrgs);
    } else {
      // remove all managedids from current orgs
      const newOrgs = currentOrgs.filter(
        (id: string) => !managedOrgIds.includes(id),
      );
      form.setFieldValue('organizations', newOrgs);
    }
  };

  const managedOrgIds = useMemo(() => {
    return rawOrganizations
      .filter((org) => org.managedByDigitalzone)
      .map((org) => org.id)
      .filter((id): id is string => id !== undefined);
  }, [rawOrganizations]);

  const popupRenderer = (menu: React.ReactElement) => {
    // Only show Select All checkbox for DZone users (Marketer with isDzoneUser enabled)
    if (isDzoneUser && isMarketer) {
      return (
        <>
          <Space style={{ padding: '8px 4px' }}>
            <Checkbox
              onChange={handleSelectAllChange}
              checked={
                organizationsList.length > 0 &&
                organizationsList?.length ===
                  form.getFieldValue('organizations')?.length
              }>
              <Flex align='center'>
                <Text strong>
                  {organizationsList.length ===
                  form.getFieldValue('organizations')?.length
                    ? 'Unselect'
                    : 'Select'}{' '}
                  All
                </Text>
                <Text
                  style={{ marginLeft: '0.5rem', color: CLR_GRAY_6 }}
                  text12>
                  ({form.getFieldValue('organizations')?.length} selected)
                </Text>
              </Flex>
            </Checkbox>
          </Space>
          <Divider style={{ margin: '4px ' }} />
          {menu}
        </>
      );
    }
    // For non-DZone users or Suppliers, just return the menu without Select All
    return menu;
  };

  // Use Ant Design Badge for managed orgs (fix style)
  const renderOptionLabel = (option: any) => {
    if (option.data.managedByDigitalzone) {
      return (
        <Flex align='center' gap='0.5rem'>
          <Text ellipsis>{option.label}</Text>
          <span
            style={{
              background: '#235aed',
              color: '#fff',
              fontWeight: 500,
              marginLeft: '4px',
              padding: '2px',
              border: 'none',
              borderRadius: '0.2rem',
              fontSize: '0.75rem',
              marginInline: '0.25rem',
            }}>
            DZ
          </span>
        </Flex>
      );
    }
    return option.label;
  };

  // Custom tagRender to lock managed orgs (no cross, not removable)
  const tagRender = (props: any) => {
    const { label, value, closable, onClose } = props;
    const isManaged = managedOrgIds.includes(value);
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: '#f5f5f5',
          borderRadius: 4,
          padding: '0 8px',
          marginRight: 4,
          marginBottom: 2,
        }}>
        {label}
        {isManaged && (
          <span
            style={{
              background: '#235aed',
              color: '#fff',
              marginLeft: '0.5rem',
              paddingInline: '2px',
              borderRadius: '0.2rem',
              fontSize: '0.6255rem',
              marginInline: '0.25rem',
            }}>
            DZ
          </span>
        )}
        {!isManaged && closable && (
          <span style={{ marginLeft: 6, cursor: 'pointer' }} onClick={onClose}>
            ×
          </span>
        )}
      </span>
    );
  };

  const handleSelectAllChange = () => {
    if (
      form.getFieldValue('organizations')?.length === organizationsList.length
    ) {
      // Select only organization ids that are managedByDigitalzone if autoAssignMarketers is true
      if (assignAllManagedOrgs && isDzoneUser) {
        const managedOrgIds = organizationsList
          .filter((org) => org.managedByDigitalzone)
          .map((org) => org.value);
        form.setFieldValue('organizations', managedOrgIds);
      } else {
        form.setFieldValue('organizations', []);
      }
    } else {
      const allOrgIds = organizationsList.map((org) => org.value);
      form.setFieldValue('organizations', allOrgIds);
    }
  };

  return (
    <>
      <DzBox dzOneBox style={{ padding: '2rem' }}>
        <Form
          form={form}
          style={{ height: '100%' }}
          layout='vertical'
          onValuesChange={onValuesChange}
          onFinish={onFinish}>
          <Flex
            gap='1rem'
            vertical
            justify='space-between'
            style={{ height: '100%' }}>
            <Flex vertical gap='1rem'>
              <DzBox>
                <Text strong>
                  {isEditing
                    ? `User Status: ${user?.status}`
                    : 'Fill Details to Invite User'}
                </Text>
              </DzBox>
              <Row>
                <Col lg={12} md={24} sm={24} xs={24}>
                  <Row gutter={16}>
                    <Col sm={12} xs={24}>
                      <FormItem
                        className='input-control form-control-item'
                        name='firstName'
                        label='First Name'
                        rules={[
                          { required: true, message: 'This field is required' },
                        ]}>
                        <Input
                          className='input-field'
                          placeholder='Enter first name'
                        />
                      </FormItem>
                    </Col>
                    <Col sm={12} xs={24}>
                      <FormItem
                        className='input-control form-control-item'
                        name='lastName'
                        label='Last Name'
                        rules={[
                          { required: true, message: 'This field is required' },
                        ]}>
                        <Input
                          className='input-field'
                          placeholder='Enter last name'
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={24}>
                      <FormItem
                        className='input-control form-control-item'
                        name='email'
                        label='Email ID'
                        rules={[
                          { required: true, message: 'This field is required' },
                          { type: 'email', message: 'Invalid email' },
                        ]}>
                        <Input
                          className='input-field'
                          placeholder='Enter email id'
                          disabled={isEditing}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <TenantType />
                  <Row gutter={16}>
                    <Col span={24}>
                      <FormItem
                        className='input-control form-control-item'
                        name='isDzoneUser'
                        valuePropName='checked'>
                        <Checkbox
                          onChange={() => setIsDzoneUser(!isDzoneUser)}
                          disabled={!isMarketer}>
                          Is DZOne User
                        </Checkbox>
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={24}>
                      <FormItem
                        className='input-control form-control-item'
                        name='roles'
                        label='Roles'
                        rules={[
                          { required: true, message: 'This field is required' },
                        ]}>
                        <Select
                          placeholder='Select roles'
                          className='input-field'
                          style={{ borderRadius: '8px' }}
                          options={roles}
                          filterOption={handleFilterOption}
                          mode='multiple'
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  {isDzoneUser && isMarketer && (
                    <Row gutter={16}>
                      <Col span={24}>
                        <FormItem
                          className='input-control form-control-item'
                          name='autoAssignMarketers'
                          valuePropName='checked'>
                          <Checkbox
                            checked={assignAllManagedOrgs}
                            disabled={organizationsList.length === 0}
                            onChange={(e) =>
                              handleAssignAllManagedOrgsChange(e.target.checked)
                            }>
                            Assign All Managed by Digitalzone Organizations
                          </Checkbox>
                        </FormItem>
                      </Col>
                    </Row>
                  )}
                  <Row gutter={16}>
                    <Col span={24}>
                      <FormItem
                        className='input-control form-control-item'
                        name='organizations'
                        label={
                          isMarketer
                            ? TenantTypeEnum.MARKETER
                            : TenantTypeEnum.SUPPLIER
                        }
                        rules={[
                          { required: true, message: 'This field is required' },
                        ]}>
                        <Select
                          placeholder={
                            isMarketer
                              ? TenantTypeEnum.MARKETER
                              : TenantTypeEnum.SUPPLIER
                          }
                          className='input-field custom-scroll-select'
                          options={organizationsList.map((opt) =>
                            assignAllManagedOrgs &&
                            isDzoneUser &&
                            isMarketer &&
                            opt.managedByDigitalzone
                              ? { ...opt, disabled: true }
                              : opt,
                          )}
                          optionLabelProp='label'
                          optionRender={renderOptionLabel}
                          dropdownRender={
                            isDzoneUser && isMarketer
                              ? popupRenderer
                              : undefined
                          }
                          mode={
                            isDzoneUser && isMarketer ? 'multiple' : undefined
                          }
                          tagRender={
                            isDzoneUser && isMarketer ? tagRender : undefined
                          }
                          onChange={(values) => {
                            // For multiple selection with managed orgs
                            if (
                              isDzoneUser &&
                              isMarketer &&
                              assignAllManagedOrgs
                            ) {
                              const multiValues = Array.isArray(values)
                                ? values
                                : [values];
                              const missingManagedOrgs = managedOrgIds.filter(
                                (id) => id && !multiValues.includes(id),
                              );
                              if (missingManagedOrgs.length > 0) {
                                const correctedValues = Array.from(
                                  new Set([
                                    ...multiValues,
                                    ...missingManagedOrgs,
                                  ]),
                                );
                                form.setFieldValue(
                                  'organizations',
                                  correctedValues,
                                );
                                return;
                              }
                            }
                          }}
                          filterOption={handleFilterOption}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Flex>
            <DzBox>
              <UserFormActions
                handleCancel={handleCancel}
                isEditing={isEditing}
                isSubmitting={isSubmitting}
                isReadOnly={!user?.editable}
              />
            </DzBox>
          </Flex>
        </Form>
      </DzBox>
      <Modal
        closable
        open={openEmailSentModal}
        footer={null}
        onCancel={handleCancel}>
        <Flex
          gap='2.75rem'
          vertical
          align='center'
          style={{ padding: '2.75rem' }}>
          <DzBox>
            <Image alt='' src='/icons/email-icon.png' preview={false} />
          </DzBox>
          <Flex gap='1.25rem' vertical align='center'>
            <Title level={4}>Email has been sent!</Title>
            <Text style={{ textAlign: 'center', fontSize: '1.125rem' }}>
              {`All Set! An invite has been sent to ${createdUser?.email || ''}. Once they accept the
            invitation, they'll be able to access the platform`}
            </Text>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};
