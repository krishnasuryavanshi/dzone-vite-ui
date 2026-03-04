import { UserActionsEnum } from '@/lib/enums/permissions';
import { usePermissionCheck } from '@/lib/hooks';
import { Button } from '@/uicomponents/button';
import { Flex } from '@/uicomponents/layout';
import { LoadingOutlined } from '@ant-design/icons';
import { FC } from 'react';

interface IUserFormActionsProps {
  handleCancel: () => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
  isReadOnly: boolean;
}

export const UserFormActions: FC<IUserFormActionsProps> = ({
  handleCancel,
  isEditing,
  isSubmitting,
  isReadOnly,
}) => {
  const isEditAllowed = usePermissionCheck(UserActionsEnum.Edit);
  const isCreateAllowed = usePermissionCheck(UserActionsEnum.Create);

  return (
    <Flex gap={'1rem'} justify='end'>
      <Button onClick={handleCancel}>Cancel</Button>

      {((isEditing && isEditAllowed && !isReadOnly) || (!isEditing && isCreateAllowed)) && (
        <Button type='primary' htmlType='submit' disabled={isSubmitting}>
          {isSubmitting ? <LoadingOutlined /> : isEditing ? 'Save' : 'Save and Invite user'}
        </Button>
      )}
    </Flex>
  );
};
