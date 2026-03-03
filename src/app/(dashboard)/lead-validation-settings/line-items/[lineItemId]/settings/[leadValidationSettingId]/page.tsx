import { useParams } from 'react-router';
import { CreateValidationSettingContainer } from '@/app/(dashboard)/lead-validation-settings/components';

const EditLineItemLeadValidationSettings = () => {
  const { leadValidationSettingId, lineItemId } = useParams<{ leadValidationSettingId: string; lineItemId: string }>();
  return (
    <>
      <title>Validation Setting | DZ One</title>
      <CreateValidationSettingContainer
        leadValidationSettingId={leadValidationSettingId!}
        lineItemId={lineItemId!}
        isEditing={true}
      />
    </>
  );
};

export default EditLineItemLeadValidationSettings;
