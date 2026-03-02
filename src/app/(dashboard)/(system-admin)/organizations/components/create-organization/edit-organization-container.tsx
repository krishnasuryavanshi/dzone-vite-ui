'use client';
import React, { FC, useEffect } from 'react';
import { CreateOrganizationContainer } from './create-organization-container';
import { IOrganization } from '../../lib/types';
import { fetchOrganization } from '../../services';

interface IEditOrganizationContainerProps {
  organizationId?: string;
}

export const EditOrganizationContainer: FC<IEditOrganizationContainerProps> = ({
  organizationId,
}) => {
  const [organization, setOrganization] = React.useState<IOrganization | null>(
    null,
  );
  useEffect(() => {
    if (organizationId) {
      fetchOrganizationDetails();
    } else {
      setOrganization(null);
    }
  }, [organizationId]);

  const fetchOrganizationDetails = async () => {
    try {
      const { data } = await fetchOrganization(organizationId as string);
      setOrganization(data);
    } catch (error) {}
  };
  if (!organization) {
    return null;
  }
  return <CreateOrganizationContainer isEditing organization={organization} />;
};
