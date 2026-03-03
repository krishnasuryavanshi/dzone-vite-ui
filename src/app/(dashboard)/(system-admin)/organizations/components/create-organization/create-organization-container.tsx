import { DzBox, DzScrollContainer } from '@/components/layout/v1';
import React, { FC } from 'react';
import { CreateOrganizationHeader } from './create-organization-header';
import { OrganizationForm } from './organization-form';
import { IOrganization } from '../../lib/types';

interface ICreateOrganizationContainerProps {
  isEditing?: boolean;
  organization?: IOrganization;
}

export const CreateOrganizationContainer: FC<
  ICreateOrganizationContainerProps
> = ({ isEditing, organization }) => {
  return (
    <DzBox className='dz-page-content'>
      <DzScrollContainer vertical scoll='outside'>
        <DzScrollContainer.Sticky>
          <CreateOrganizationHeader isEditing={isEditing} />
        </DzScrollContainer.Sticky>
        <DzScrollContainer.Scroll>
          <OrganizationForm isEditing={isEditing} organization={organization} />
        </DzScrollContainer.Scroll>
      </DzScrollContainer>
    </DzBox>
  );
};
