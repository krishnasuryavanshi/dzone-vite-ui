import { useParams } from 'react-router-dom';
import { useSession } from 'next-auth/react';
import { ShowLineItemContainer } from '@/app/(dashboard)/campaign-management/line-items/components/show-line-item';
import React from 'react';

export default function LineItemDetailsPage() {
  const { lineItemId, campaignId } = useParams<{ lineItemId: string; campaignId: string }>();
  const { data: session } = useSession();
  const sessionTenantCode = session?.tenantCode;
  return (
    <ShowLineItemContainer lineItemId={lineItemId!} campaignId={campaignId!} sessionTenantCode={sessionTenantCode} />
  );
}
