import { useSession } from '@/lib/hooks/use-session';
import { CreateTemplate } from '../components/create-template';

export default function CreateTemplatePage() {
  const { data: session } = useSession();
  const userDetails = session?.user;
  const isDzoneUser = session?.isDzoneUser;
  const sessionTenantCode = session?.tenantCode;
  return (
    <>
      <title>Create Template | DZ One</title>
      <CreateTemplate
        existingTemplate={false}
        userDetails={userDetails}
        isDzoneUser={isDzoneUser}
        tenantCode={sessionTenantCode ?? ''}
      />
    </>
  );
}
