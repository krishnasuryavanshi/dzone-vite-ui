import { Flex } from 'antd';
import React, { FC } from 'react';
import { CancelButton, ICancelButtonProps } from './cancel-button';
import { CampaignValues } from '@/app/(dashboard)/campaign-management/campaigns/lib/utils';
import {
  ISaveAndCloseButtonProps,
  SaveAndCloseButton,
} from './save-and-close-button';
import { ISubmitButtonProps, SubmitButton } from './submit-button';
import { INextButtonProps, NextButton } from './next-button';
import './stepper-form-footer.scss';
import { lastStep } from '@/components/util';

interface IStepperFormFooterProps
  extends ISubmitButtonProps,
    ICancelButtonProps,
    INextButtonProps,
    ISaveAndCloseButtonProps {
  style?: React.CSSProperties;
  step?: number | string;
  title?: string;
  showSaveAndClose?: boolean;
}

export const StepperFormFooter: FC<IStepperFormFooterProps> = ({
  onCancel,
  onSaveAndClose,
  onSubmit,
  onNext,
  step,
  style,
  title,
  showSaveAndClose = true,
}) => {
  const isLastStep = lastStep(step, title);
  return (
    <Flex
      className="form-footer stepper-form-footer"
      justify="end"
      align="center"
      wrap="wrap"
      gap={'1rem'}
      style={style}
    >
      <CancelButton onCancel={onCancel} />
      <SubmitButton
        show={isLastStep && showSaveAndClose !== false}
        onSubmit={onSubmit}
      />
      <SaveAndCloseButton
        show={!isLastStep && showSaveAndClose !== false}
        onSaveAndClose={onSaveAndClose}
      />
      <NextButton
        show={!isLastStep}
        onNext={onNext}
      />
    </Flex>
  );
};
