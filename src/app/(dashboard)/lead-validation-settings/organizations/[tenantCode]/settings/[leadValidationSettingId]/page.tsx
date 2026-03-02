import { useParams } from 'react-router-dom';
import { CreateValidationSettingContainer } from '@/app/(dashboard)/lead-validation-settings/components';

const EditLeadValidationSettings = () => {
  const { leadValidationSettingId, tenantCode } = useParams<{ leadValidationSettingId: string; tenantCode: string }>();
  return (
    <CreateValidationSettingContainer
      leadValidationSettingId={leadValidationSettingId!}
      tenantCode={tenantCode!}
      isEditing={true}
    />
  );
};

export default EditLeadValidationSettings;
