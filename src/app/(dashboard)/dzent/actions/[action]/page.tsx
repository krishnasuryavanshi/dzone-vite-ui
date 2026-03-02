import { useParams } from 'react-router-dom';
import { DzentContainerHost } from '../../components/dzent-container-host';

export default function DZentActionPage() {
  const { action } = useParams<{ action: string }>();
  return <DzentContainerHost action={action || ''} />;
}
