import React from 'react';
import { useParams } from 'react-router-dom';
import { IntegrationDetailsContainer } from './components/integration-details-container';

export default function IntegrationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  return <IntegrationDetailsContainer integrationId={id!} />;
}
