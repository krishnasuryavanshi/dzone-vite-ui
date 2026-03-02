import { Flex } from '@/uicomponents/layout';
import { ValidationSettingsBackNavigation } from './validation-settings-back-navigation';
import { ValidationSettingsTitle } from './validation-settings-title';

export const CreateValidationSettingHeader = ({
  isEditing,
}: {
  isEditing: boolean;
}) => {
  return (
    <Flex gap='0.75rem' vertical>
      <ValidationSettingsTitle />
      <ValidationSettingsBackNavigation isEditing={isEditing} />
    </Flex>
  );
};
