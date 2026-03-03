import React, { FC } from 'react';
import { CreateOrganizationContainer } from './create-organization-container';
import { useOrganizationDetailQuery } from '../../hooks';

interface IEditOrganizationContainerProps {
  organizationId?: string;
}

export const EditOrganizationContainer: FC<IEditOrganizationContainerProps> = ({
  organizationId,
}) => {
  const { data } = useOrganizationDetailQuery(
    organizationId as string,
    !!organizationId,
  );
  const organization = data?.data ?? null;

  if (!organization) {
    return null;
  }
  return <CreateOrganizationContainer isEditing organization={organization} />;
};
