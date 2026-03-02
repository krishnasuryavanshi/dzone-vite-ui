import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSession } from 'next-auth/react';
import { CreateNewLineItem } from '../components/create-new-line-item';

export default function CreateLineItemPage() {
  const [searchParams] = useSearchParams();
  const lineItemId = searchParams.get('lineItemId') ?? undefined;
  const { data: session } = useSession();
  const userDetails = session?.user;
  const tenantCode = session?.tenantCode;
  const isDzoneUser = session?.isDzoneUser;
  return (
    <CreateNewLineItem
      tenantCode={tenantCode}
      userDetails={userDetails}
      isDzoneUser={isDzoneUser}
      lineItemId={lineItemId}
    />
  );
}
