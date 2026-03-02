import { useParams } from 'react-router-dom';
import { useSession } from 'next-auth/react';
import UpdateLineItem from '@/app/(dashboard)/campaign-management/line-items/components/update-line-item/update-line-item';

export default function UpdateLineItemPage() {
  const { lineItemId } = useParams<{ lineItemId: string }>();
  const { data: session } = useSession();
  const userDetails = session?.user;
  const tenantCode = session?.tenantCode;
  return (
    <UpdateLineItem
      lineItemId={lineItemId!}
      userDetails={userDetails}
      tenantCode={tenantCode}
    />
  );
}
