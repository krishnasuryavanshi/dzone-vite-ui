import React from 'react';
import { useSession } from '@/lib/hooks/use-session';
import { CampaignListContainer } from './campiagn-list-container';

export default function CampaignsPage() {
  const { data: session } = useSession();
  const isDzoneUser = session?.isDzoneUser;
  return <CampaignListContainer isDzoneUser={isDzoneUser} />;
}
