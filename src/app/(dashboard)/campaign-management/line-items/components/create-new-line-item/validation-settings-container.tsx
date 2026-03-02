import { Hideable } from '@/components/shared';
import { Button } from '@/uicomponents/index';
import { Flex } from '@/uicomponents/layout';
import { useRouter } from 'next/navigation';
import { LeadValidationSettingsContainer } from '../lead-validation-settings';

type ValidationSettingsContainerProps = {
  lineItemId?: string;
  leadValidationSettingId: string;
  nextStep?: number;
  handleStepperChange?: (key: number) => void;
};

export const ValidationSettingsContainer = ({
  lineItemId,
  leadValidationSettingId,
  nextStep,
  handleStepperChange,
}: ValidationSettingsContainerProps) => {
  const router = useRouter();

  const handleNext = () => {
    handleStepperChange && nextStep && handleStepperChange(nextStep);
  };

  const handleCancel = () => {
    router.push(`/campaign-management/line-items`);
  };

  return (
    <Flex vertical gap={'1rem'}>
      <LeadValidationSettingsContainer
        isEditing={true}
        lineItemId={lineItemId}
        leadValidationSettingId={leadValidationSettingId}
      />
      <Hideable show={!!nextStep}>
        <Flex justify='end' gap={'0.5rem'}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type='primary' onClick={handleNext}>
            Next
          </Button>
        </Flex>
      </Hideable>
      <Hideable show={!nextStep}>
        <Flex justify='end' gap={'0.5rem'}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type='primary' onClick={handleCancel}>
            Done
          </Button>
        </Flex>
      </Hideable>
    </Flex>
  );
};
