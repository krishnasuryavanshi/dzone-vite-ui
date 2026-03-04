import { useParams } from 'react-router';
import { useSession } from '@/lib/hooks/use-session';
import { DeliveryLogsContainer } from '../../components/delivery-schedules-logs';

export default function DeliveryLogsPage() {
  const { lineItemId } = useParams<{ lineItemId: string }>();
  const { data: session } = useSession();
  const sessionTenantCode = session?.tenantCode;

  return (
    <>
      <title>Delivery Logs | DZ One</title>
      <DeliveryLogsContainer lineItemId={lineItemId!} sessionTenantCode={sessionTenantCode} />
    </>
  );
}
