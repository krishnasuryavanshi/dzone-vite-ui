import React from 'react';
import { useSearchParams } from 'react-router';
import { useSession } from '@/lib/hooks/use-session';
import { CreateNewLineItem } from '../components/create-new-line-item';

export default function CreateLineItemPage() {
  const [searchParams] = useSearchParams();
  const lineItemId = searchParams.get('lineItemId') ?? undefined;
  const { data: session } = useSession();
  const userDetails = session?.user;
  const tenantCode = session?.tenantCode;
  const isDzoneUser = session?.isDzoneUser;
  return (
    <>
      <title>Create Line Item | DZ One</title>
      <CreateNewLineItem
        tenantCode={tenantCode}
        userDetails={userDetails}
        isDzoneUser={isDzoneUser}
        lineItemId={lineItemId}
      />
    </>
  );
}
