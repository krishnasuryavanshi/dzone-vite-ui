import { useParams } from 'react-router-dom';
import { useSession } from 'next-auth/react';
import { DeliveryLogsContainer } from '../../components/delivery-schedules-logs';

export default function DeliveryLogsPage() {
  const { lineItemId } = useParams<{ lineItemId: string }>();
  const { data: session } = useSession();
  const sessionTenantCode = session?.tenantCode;

  return (
    <DeliveryLogsContainer
      lineItemId={lineItemId!}
      sessionTenantCode={sessionTenantCode}
    />
  );
}
