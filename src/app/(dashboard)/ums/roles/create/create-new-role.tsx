import { DzBox, DzScrollContainer } from '@/components/layout/v1';
import { showNotification } from '@/services/notification';
import { useForm, useWatch } from '@/uicomponents/form';
import { Flex } from '@/uicomponents/layout';
import { debounce, isEqual } from 'lodash';
import { useRouter } from '@/lib/hooks/use-router';
import { FC, useEffect, useState } from 'react';
import { RolePermissioBreadcrumb } from '../components';
import { RolePermissionsForm } from '../components/create';
import { DiscardModal } from '../components/modals';
import { RolesAndPermissionsTitle } from '../components/roles-and-permissions-title';
import { saveRoleAndPermissions } from '../services/save-roles-and-permissions';
import { updateRoleAndPermissionsByRoleId } from '../services/update-role-and-permissions-by-role-id';
import {
  useEditStore,
  useOldSelectedStore,
  useSelectedActionsStore,
  useSelectedPermissionsStore,
} from '../stores';
import { ScreenLoader } from '@/components/shared/loader';
import { createActionsPermissions, getModulePermissionsAccess } from '../lib/utils';
import { useTenantTypeStore } from '@/stores/tenant-store';
import { useRoleDetailQuery } from '../hooks';

interface ICreateNewRoleProps {
  roleId?: string;
}

export const CreateNewRole: FC<ICreateNewRoleProps> = ({ roleId }) => {
  const router = useRouter();
  const [form] = useForm();
  const formValues = useWatch([], form);

  const { isEditing, setIsEditing, setIsEditAllowed } = useEditStore();
  const {
    resetSelectedPermissions,
    setBulkSelectedPermissions,
    selectedPermissions,
    getAllSelectedPermissions,
  } = useSelectedPermissionsStore();
  const {
    oldSelectedActions,
    oldSelectedPermissions,
    setOldSelectedActions,
    setOldSelectedPermissions,
    resetOldSelectedStores,
  } = useOldSelectedStore();
  const { resetSelectedActions, selectedActions, setBulkSelectedActions, getAllSelectedActions } =
    useSelectedActionsStore();

  const { tenantTypes, fetchTenantTypes } = useTenantTypeStore();

  const { data: roleResponse, isLoading } = useRoleDetailQuery(roleId);

  const roleDetails = roleResponse?.data ?? null;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState<boolean>(true);
  const [hasFormValueChanged, setHasFormValueChanged] = useState<boolean>(false);
  const [isPermissionsChanged, setIsPermissionsChanged] = useState<boolean>(false);

  useEffect(() => {
    resetStores();
    fetchTenantTypes();
  }, []);

  useEffect(() => {
    if (!isEditing) {
      form.setFieldValue('tenantType', tenantTypes[0]?.name);
    }
  }, [tenantTypes, isEditing]);

  useEffect(() => {
    if (roleId) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setIsEditAllowed(false);
    }
  }, [roleId]);

  // Sync role details from query into stores
  useEffect(() => {
    if (roleDetails && roleId) {
      const { actions, permissions } = createActionsPermissions(roleDetails?.moduleAttributes);
      setBulkSelectedActions(actions || {});
      setBulkSelectedPermissions(permissions || {});
      setOldSelectedActions(Object.values(actions).flat());
      setOldSelectedPermissions(Object.values(permissions).flat());
    }
  }, [roleDetails, roleId]);

  useEffect(() => {
    if (!isEditing) {
      // roleDetails is derived from query, no need to reset state
    }
  }, [isEditing]);

  useEffect(() => {
    if (roleDetails && isEditing) {
      const initialValues = {
        name: roleDetails?.name,
        description: roleDetails?.description,
        status: roleDetails?.status,
        tenantType: roleDetails?.tenantType,
      };
      form.setFieldsValue(initialValues);
    }
  }, [roleDetails, isEditing, form]);

  useEffect(() => {
    if (isEditing && formValues) {
      const hasChanges =
        formValues?.name !== roleDetails?.name ||
        formValues?.description !== roleDetails?.description ||
        formValues?.status?.name !== roleDetails?.status?.name ||
        formValues?.tenantType !== roleDetails?.tenantType;
      form
        .validateFields(['name'])
        .then(() => setHasFormValueChanged(hasChanges))
        .catch(() => setHasFormValueChanged(false));
    } else {
      if (formValues?.name === undefined || formValues?.name === '') {
        setHasFormValueChanged(false);
      } else {
        form
          .validateFields({ validateOnly: true })
          .then(() => setHasFormValueChanged(true))
          .catch(() => setHasFormValueChanged(false));
      }
    }
  }, [formValues, isEditing, form]);

  useEffect(() => {
    debouncedCheckIfPermissionsChanged();
  }, [selectedActions, selectedPermissions]);

  useEffect(() => {
    const shouldEnableSaveButton = hasFormValueChanged || isPermissionsChanged;
    setIsSaveButtonDisabled(!shouldEnableSaveButton);
  }, [hasFormValueChanged, isPermissionsChanged]);

  const resetStores = () => {
    resetSelectedPermissions();
    resetSelectedActions();
    resetOldSelectedStores();
  };

  const submitForm = async () => {
    try {
      setLoader(true);
      const values = await form.validateFields();

      const roleObject = {
        ...values,
        moduleAttributes: getModulePermissionsAccess(selectedActions, selectedPermissions),
      };

      const data = roleDetails?.id
        ? await updateRoleAndPermissionsByRoleId(roleDetails?.id, roleObject)
        : await saveRoleAndPermissions(roleObject);
      if (data.data) {
        showNotification({ message: data.message });
        handleDiscard();
      } else {
        showNotification({ message: data.message, type: 'error' });
      }
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  const checkIfPermissionsChanged = () => {
    const selectedPermissionsIds = getAllSelectedPermissions();
    const selectedActionsIds = getAllSelectedActions();

    const permissionsChanged =
      !isEqual(selectedActionsIds, oldSelectedActions) ||
      !isEqual(selectedPermissionsIds, oldSelectedPermissions);
    setIsPermissionsChanged(permissionsChanged);
  };

  const debouncedCheckIfPermissionsChanged = debounce(checkIfPermissionsChanged, 500);

  const debouncedSubmitForm = debounce(submitForm, 500);

  const resetForm = () => {
    form.resetFields();
    resetStores();
    setIsEditing(false);
    setIsEditAllowed(false);
  };

  const handleCancelModal = () => {
    const hasChanges = hasFormValueChanged || isPermissionsChanged;
    if (hasChanges) {
      setIsOpen(true);
    } else {
      handleDiscard();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDiscard = () => {
    router.push('/ums/roles');
    resetForm();
  };

  if (isLoading) return <ScreenLoader />;

  return (
    <DzBox className='dz-page-content'>
      <DzScrollContainer vertical scoll='outside'>
        <DzScrollContainer.Sticky>
          <Flex vertical justify='center'>
            <RolesAndPermissionsTitle />
            <RolePermissioBreadcrumb
              name={roleDetails?.name}
              onBack={() => {
                handleCancelModal();
              }}
            />
          </Flex>
        </DzScrollContainer.Sticky>
        <DzScrollContainer.Scroll>
          <RolePermissionsForm
            roleDetails={roleDetails!}
            form={form}
            handleCancel={handleCancelModal}
            handleSubmit={debouncedSubmitForm}
            isSaveButtonDisabled={isSaveButtonDisabled}
            loader={loader}
          />
        </DzScrollContainer.Scroll>
      </DzScrollContainer>
      <DiscardModal show={isOpen} handleDiscard={handleDiscard} handleClose={handleClose} />
    </DzBox>
  );
};
