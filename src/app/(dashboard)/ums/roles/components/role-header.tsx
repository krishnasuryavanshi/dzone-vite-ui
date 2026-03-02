import { Flex } from '@/uicomponents/layout';
import { CreateNewRole } from './create';
import { RolesAndPermissionsTitle } from './roles-and-permissions-title';
import { HasPermission } from '@/components/auth';
import { RoleActionsEnum } from '@/lib/enums/permissions';

export const RoleHeader = () => {
  return (
    <Flex gap='0.75rem' justify='space-between' align='center'>
      <RolesAndPermissionsTitle />
      <Flex gap='0.75rem' justify='space-between'>
        <HasPermission permissions={RoleActionsEnum.Create}>
          <CreateNewRole />
        </HasPermission>
      </Flex>
    </Flex>
  );
};
