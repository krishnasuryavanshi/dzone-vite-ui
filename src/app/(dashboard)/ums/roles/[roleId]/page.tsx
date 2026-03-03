import { useParams } from 'react-router';
import { ViewRoleContainer } from '../components/view-role-container';

const ViewPermissionPage = () => {
  const { roleId } = useParams<{ roleId: string }>();
  return (
    <>
      <title>Role Details | DZ One</title>
      <ViewRoleContainer roleId={roleId!} />
    </>
  );
};

export default ViewPermissionPage;
