import { DzBox } from '@/components/layout/v1';
import { showNotification } from '@/services';
import { Button, Text } from '@/uicomponents/index';
import { Flex } from '@/uicomponents/layout';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { validateLineItem } from '../../services';
import { LeadValidationSettingsRules } from './lead-validation-settings-rules';
import { HasPermission } from '@/components/auth';
import { LineItemActionsEnum } from '@/lib/enums/permissions';

type LeadValidationSettingsWrapperProps = {
  isEditing?: boolean;
  lineItemId?: string;
  leadValidationSettingId?: string;
};

export const LeadValidationSettingsWrapper = ({
  isEditing = false,
  lineItemId,
  leadValidationSettingId,
}: LeadValidationSettingsWrapperProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const validateCampaignDetails = async () => {
    setIsLoading(true);
    try {
      const data = await validateLineItem(lineItemId as string);
      if (data?.data) {
        navigateToSettings();
      }
    } catch (error) {
      showNotification({ message: error as string, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSettings = () => {
    const queryParam = isEditing ? 'edit' : 'view';
    router.push(
      `/lead-validation-settings/line-items/${lineItemId}/settings/${leadValidationSettingId}?redirectTo=${queryParam}`,
    );
  };

  return (
    <Flex vertical>
      <Flex justify='end' align='center'>
        {/* Show Edit All button for editing mode */}
        {isEditing && (
          <HasPermission
            permissions={[LineItemActionsEnum.EditValidationSettings]}>
            <Button
              type='link'
              style={{ height: '1.5rem', padding: '0 0.5rem' }}
              loading={isLoading}
              onClick={validateCampaignDetails}>
              Edit All
            </Button>
          </HasPermission>
        )}

        {/* Show View All button for view mode */}
        {!isEditing && (
          <HasPermission
            permissions={[LineItemActionsEnum.ViewValidationSettings]}>
            <Button
              type='link'
              style={{ height: '1.5rem', padding: '0 0.5rem' }}
              loading={isLoading}
              onClick={validateCampaignDetails}>
              View All
            </Button>
          </HasPermission>
        )}
      </Flex>
      <DzBox>
        <LeadValidationSettingsRules isEditing={isEditing} />
      </DzBox>
    </Flex>
  );
};
