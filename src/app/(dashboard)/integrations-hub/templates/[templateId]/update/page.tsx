import { useParams } from 'react-router';
import { useSession } from '@/lib/hooks/use-session';
import { CreateTemplate } from '../../components/create-template';

export default function UpdateTemplatePage() {
  const { templateId } = useParams<{ templateId: string }>();
  const { data: session } = useSession();
  const userDetails = session?.user;
  const isDzoneUser = session?.isDzoneUser;
  const sessionTenantCode = session?.tenantCode;
  return (
    <CreateTemplate
      templateId={templateId!}
      userDetails={userDetails}
      isDzoneUser={isDzoneUser}
      tenantCode={sessionTenantCode ?? ''}
      existingTemplate
    />
  );
}
