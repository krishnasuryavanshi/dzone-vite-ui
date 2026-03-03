import { useParams } from 'react-router';
import { CreateValidationSettingContainer } from '@/app/(dashboard)/lead-validation-settings/components';

const EditLineItemLeadValidationSettings = () => {
  const { leadValidationSettingId, lineItemId } = useParams<{ leadValidationSettingId: string; lineItemId: string }>();
  return (
    <CreateValidationSettingContainer
      leadValidationSettingId={leadValidationSettingId!}
      lineItemId={lineItemId!}
      isEditing={true}
    />
  );
};

export default EditLineItemLeadValidationSettings;
