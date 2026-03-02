import { Flex } from '@/uicomponents/layout';
import React, { FC } from 'react';
import { OrganizationsTitle } from '../organizations-title';
import { BackNavigation } from './back-navigation';

interface ICreateOrganizationHeaderProps {
  isEditing?: boolean;
}

export const CreateOrganizationHeader: FC<ICreateOrganizationHeaderProps> = ({
  isEditing,
}) => {
  return (
    <Flex gap='0.75rem' vertical>
      <OrganizationsTitle />
      <BackNavigation isEditing={isEditing} />
    </Flex>
  );
};
