import { useValidationSettingStore } from '@/app/(dashboard)/lead-validation-settings/store';
import { useValidationSettingConfigQuery } from '@/app/(dashboard)/lead-validation-settings/hooks';
import { DzBox } from '@/components/layout/v1';
import { useEffect, useMemo } from 'react';
import { LeadValidationSettingsWrapper } from './lead-validation-settings-wrapper';

type LeadValidationSettingsContainerProps = {
  isEditing?: boolean;
  lineItemId?: string;
  leadValidationSettingId?: string;
};

export const LeadValidationSettingsContainer = ({
  isEditing = false,
  lineItemId,
  leadValidationSettingId,
}: LeadValidationSettingsContainerProps) => {
  const {
    processConfigurationResponse,
    setLeadValidationSettingInfo,
    setIsEditing,
    resetAll,
    leadValidationSettingInfo,
    leadValidationSettingConfig,
  } = useValidationSettingStore();

  useEffect(() => {
    resetAll();
  }, []);

  useEffect(() => {
    if (lineItemId && leadValidationSettingId) {
      setIsEditing(true);
      setLeadValidationSettingInfo({ lineItemId, leadValidationSettingId });
    } else {
      setIsEditing(false);
      setLeadValidationSettingInfo(null);
    }
  }, [lineItemId, leadValidationSettingId]);

  const queryEnabled = useMemo(() => {
    if (!isEditing) return true;
    return !!leadValidationSettingInfo?.lineItemId;
  }, [isEditing, leadValidationSettingInfo]);

  const { data: configResponse } = useValidationSettingConfigQuery(
    isEditing,
    leadValidationSettingInfo,
    queryEnabled,
  );

  useEffect(() => {
    if (configResponse) {
      processConfigurationResponse(configResponse, isEditing, leadValidationSettingInfo);
    }
  }, [configResponse]);

  if (!leadValidationSettingConfig) {
    return null;
  }

  return (
    <DzBox>
      <LeadValidationSettingsWrapper
        isEditing={isEditing}
        lineItemId={lineItemId}
        leadValidationSettingId={leadValidationSettingId}
      />
    </DzBox>
  );
};
