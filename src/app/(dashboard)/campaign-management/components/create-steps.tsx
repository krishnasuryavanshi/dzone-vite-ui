import React, { FC } from 'react';
import { Steps } from '@/uicomponents';
import './create-steps.scss';
import { CampaignStep } from '../campaigns/lib/enums';
import { Translate } from '@/components/i18n';
import { NewLineItemSteps } from '../line-items/lib/enums';

interface ICreateSteps {
  className?: string;
  currentStep: number;
  onHandleChange: (key: any) => void;
  steps: any;
  translation?: string;
  stepKeys: Record<number, string>;
  savedSteps: { step: number; status: 'processed' }[];
  isDzoneUser?: boolean;
}

export const CreateSteps: FC<ICreateSteps> = ({
  className,
  currentStep,
  onHandleChange,
  steps,
  translation,
  stepKeys,
  savedSteps,
}) => {
  const stepsItems = Object.entries(steps).map(([stepKey, stepValue]) => {
    const step = Number(stepKey) as CampaignStep | NewLineItemSteps;
    const savedStep =
      savedSteps && savedSteps.find((item) => item.step === step);
    let status: 'wait' | 'process' | 'finish' | 'error' | undefined;
    if (savedStep && savedStep.status === 'processed' && step !== currentStep) {
      status = 'finish';
    } else if (step === currentStep) {
      status = 'process';
    } else {
      status = 'wait';
    }

    return {
      title: (
        <Translate
          i18nKey={
            translation
              ? `${translation}.${stepKeys[step as keyof typeof stepKeys]}`
              : stepKeys[step as keyof typeof stepKeys]
          }
        />
      ),
      status,
    };
  });
  return (
    <Steps
      current={currentStep}
      labelPlacement='vertical'
      items={stepsItems}
      className={`dz-one-steps-form ${className || ''}`}
      onChange={onHandleChange}
    />
  );
};
