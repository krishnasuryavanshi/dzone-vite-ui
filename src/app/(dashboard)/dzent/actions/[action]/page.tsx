import { useParams } from 'react-router';
import { DzentContainerHost } from '../../components/dzent-container-host';

export default function DZentActionPage() {
  const { action } = useParams<{ action: string }>();
  return <DzentContainerHost action={action || ''} />;
}
