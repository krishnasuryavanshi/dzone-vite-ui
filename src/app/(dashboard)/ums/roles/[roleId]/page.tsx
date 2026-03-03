import { useParams } from 'react-router';
import { ViewRoleContainer } from '../components/view-role-container';

const ViewPermissionPage = () => {
  const { roleId } = useParams<{ roleId: string }>();
  return <ViewRoleContainer roleId={roleId!} />;
};

export default ViewPermissionPage;
