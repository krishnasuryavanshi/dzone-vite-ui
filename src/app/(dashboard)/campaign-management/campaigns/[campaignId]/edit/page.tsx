import { useParams } from 'react-router';
import { useSession } from '@/lib/hooks/use-session';
import { CreateCampaignForm } from '../../create/create-campaign-form';

export default function UpdateCampaignPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { data: session } = useSession();
  const tenantCode = session?.tenantCode || null;
  const isDzoneUser = session?.isDzoneUser;
  const userDetails = session?.user;
  return (
    <>
      <title>Edit Campaign | DZ One</title>
      <CreateCampaignForm
        tenantCode={tenantCode}
        userDetails={userDetails}
        isDzoneUser={isDzoneUser}
        campaignUUId={campaignId}
      />
    </>
  );
}
