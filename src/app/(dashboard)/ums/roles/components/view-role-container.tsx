import { FC } from 'react';
import { CreateNewRole } from '../create/create-new-role';

interface IViewRoleContainerProps {
  roleId: string;
}

export const ViewRoleContainer: FC<IViewRoleContainerProps> = ({ roleId }) => {
  return <CreateNewRole roleId={roleId} />;
};
