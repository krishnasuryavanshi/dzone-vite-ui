import React from 'react';
import { useParams } from 'react-router';
import { EditOrganizationContainer } from '../components/create-organization/edit-organization-container';

const EditOrganizationPage = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  return (
    <>
      <title>Organization Details | DZ One</title>
      <EditOrganizationContainer organizationId={organizationId!} />
    </>
  );
};

export default EditOrganizationPage;
