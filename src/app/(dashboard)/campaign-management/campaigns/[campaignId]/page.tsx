import { useParams } from 'react-router-dom';
import { useSession } from 'next-auth/react';
import { ViewCampaignContainer } from '@/app/(dashboard)/campaign-management/campaigns/show-campaign';
import React from 'react';

export default function CampaignDetailsPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { data: session } = useSession();
  const isDzoneUser = session?.isDzoneUser;
  return (
    <ViewCampaignContainer
      campaignId={campaignId!}
      isDzoneUser={isDzoneUser}
    />
  );
}
