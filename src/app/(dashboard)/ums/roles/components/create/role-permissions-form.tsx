import { Flex } from '@/uicomponents/layout';
import { BasicDetailsForm } from './basic-details-form';
import { DzBox } from '@/components/layout/v1';
import { Form, FormInstance } from '@/uicomponents/form';
import { DebouncedFunc } from 'lodash';
import { FormFooter } from '../form-footer';
import { ModulesContainer } from './modules';
import { FC } from 'react';
import { Switch } from '@/uicomponents/switch';
import { Text } from '@/uicomponents/text';
import { Translate } from '@/components/i18n';
import { CLR_GRAY_3 } from '@/lib/constants';
import { useEditStore } from '../../stores';
import { IRoleDetails } from '../../lib/types';
import { HasPermission } from '@/components/auth';
import { RoleActionsEnum } from '@/lib/enums/permissions';

interface IRolePermissionFormProps {
  form: FormInstance<any>;
  handleCancel: () => void;
  handleSubmit: DebouncedFunc<() => Promise<void>>;
  isSaveButtonDisabled: boolean;
  roleDetails: IRoleDetails;
  loader: boolean;
}

export const RolePermissionsForm: FC<IRolePermissionFormProps> = ({
  form,
  handleCancel,
  handleSubmit,
  isSaveButtonDisabled,
  roleDetails,
  loader,
}) => {
  const { isEditAllowed, setIsEditAllowed } = useEditStore();

  const handleEditToggle = () => {
    setIsEditAllowed(!isEditAllowed);
  };

  return (
    <DzBox
      dzOneBox
      style={{
        position: 'relative',
        padding: '1rem',
        flex: 1,
        overflowY: 'auto',
        minHeight: 0,
      }}>
      <Flex
        vertical
        gap='0.5rem'
        style={{
          padding: '0.5rem',
          flex: 1,
          minHeight: '75vh',
          overflowY: 'auto',
        }}>
        <Form form={form} layout='vertical'>
          <Flex vertical gap='1rem'>
            <HasPermission permissions={RoleActionsEnum.Edit}>
              {roleDetails?.id && (
                <Flex
                  gap='0.5rem'
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: CLR_GRAY_3,
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}>
                    <Translate i18nKey='pages.rolesAndPermissions.label.editMode' />
                  </Text>
                  <Switch
                    checked={isEditAllowed}
                    onChange={handleEditToggle}
                    className={`action-item-switch ${isEditAllowed ? 'checked' : ''}`}
                  />
                </Flex>
              )}
            </HasPermission>
            <BasicDetailsForm form={form} roleDetails={roleDetails} />
            <ModulesContainer roleDetails={roleDetails} />
          </Flex>
        </Form>
        <FormFooter
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          isDisabled={isSaveButtonDisabled}
          loader={loader}
        />
      </Flex>
    </DzBox>
  );
};
