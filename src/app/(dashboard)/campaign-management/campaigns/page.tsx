import React from 'react';
import { useSession } from 'next-auth/react';
import { CampaignListContainer } from './campiagn-list-container';

export default function CampaignsPage() {
  const { data: session } = useSession();
  const isDzoneUser = session?.isDzoneUser;
  return <CampaignListContainer isDzoneUser={isDzoneUser} />;
}
