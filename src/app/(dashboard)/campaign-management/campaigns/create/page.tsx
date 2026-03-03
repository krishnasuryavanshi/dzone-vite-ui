import React from 'react';
import { useSession } from '@/lib/hooks/use-session';
import { CreateCampaignForm } from './create-campaign-form';
// import { CreateCampaign } from './create-campaign';

export default function CreateCampaignsTempPage() {
  const { data: session } = useSession();
  const tenantCode = session?.tenantCode || null;
  const userDetails = session?.user;
  const isDzoneUser = session?.isDzoneUser || false;
  return (
    <>
      <title>Create Campaign | DZ One</title>
      <CreateCampaignForm
        tenantCode={tenantCode}
        userDetails={userDetails}
        isDzoneUser={isDzoneUser}
      />
    </>
  );
}
