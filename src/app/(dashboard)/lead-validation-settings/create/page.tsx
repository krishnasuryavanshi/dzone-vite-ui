import React, { FC } from 'react';
import { CreateValidationSettingContainer } from '../components';

interface IPageProps {}

const CreateLeadValidationSettings: FC<IPageProps> = ({}) => {
  return (
    <>
      <title>Create Validation Setting | DZ One</title>
      <CreateValidationSettingContainer isEditing={false} />
    </>
  );
};

export default CreateLeadValidationSettings;
