import React from 'react';
import { useSession } from 'next-auth/react';
import { CreateCampaignForm } from './create-campaign-form';
// import { CreateCampaign } from './create-campaign';

export default function CreateCampaignsTempPage() {
  const { data: session } = useSession();
  const tenantCode = session?.tenantCode || null;
  const userDetails = session?.user;
  const isDzoneUser = session?.isDzoneUser || false;
  return (
    <CreateCampaignForm
      tenantCode={tenantCode}
      userDetails={userDetails}
      isDzoneUser={isDzoneUser}
    />
  );
}
