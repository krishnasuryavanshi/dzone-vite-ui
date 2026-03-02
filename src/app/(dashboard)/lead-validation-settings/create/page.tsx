import React, { FC } from 'react';
import { CreateValidationSettingContainer } from '../components';

interface IPageProps {}

const CreateLeadValidationSettings: FC<IPageProps> = ({}) => {
  return <CreateValidationSettingContainer isEditing={false} />;
};

export default CreateLeadValidationSettings;
