import React from 'react';
import { useParams } from 'react-router-dom';
import { EditOrganizationContainer } from '../components/create-organization/edit-organization-container';

const EditOrganizationPage = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  return <EditOrganizationContainer organizationId={organizationId!} />;
};

export default EditOrganizationPage;
