import React, { FC } from 'react';
import { CreateSteps } from '../../components/create-steps';
import { StepKeysList } from '../lib/constants';
import { CreateCampaignConfig } from '../config/form';
import { cloneDeep } from 'lodash';

interface IStepsProps {
  currentStep: number;
  handleStepperChange: (key: number) => void;
  savedSteps: { step: number; status: 'processed' }[];
  isDzoneUser?: boolean;
}

export const StepsControl: FC<IStepsProps> = ({
  currentStep,
  handleStepperChange,
  savedSteps,
  isDzoneUser,
}) => {
  const { steps, translation } = cloneDeep(CreateCampaignConfig(isDzoneUser));

  return (
    <CreateSteps
      currentStep={currentStep}
      onHandleChange={handleStepperChange}
      stepKeys={StepKeysList}
      steps={steps}
      translation={translation}
      savedSteps={savedSteps}
      isDzoneUser={isDzoneUser}
    />
  );
};
