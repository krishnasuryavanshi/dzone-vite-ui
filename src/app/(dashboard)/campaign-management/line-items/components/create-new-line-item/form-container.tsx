import { DzBox } from '@/components/layout/v1';
import { ScreenLoader } from '@/components/shared/loader';
import { LineItemActionsEnum } from '@/lib/enums/permissions/line-item.enum';
import { usePermissionCheck } from '@/lib/hooks/use-action-permission-check';
import { Flex } from 'antd';
import { FC, useState } from 'react';
import { useUpdateQueryState } from '../../../lib/hooks';
import { StepsControl } from '../create-line-item/steps-control';
import { BasicDetails } from './basic-details';
import { CustomFieldsWrapper } from './custom-fields';
import { ValidationSettingsContainer } from './validation-settings-container';

interface IFormContainerProps {
  campaignUuid?: string;
  campaignData?: any;
  tenantCode?: string | string[];
  lineItemId?: string;
  lineItemDetails?: any;
  userId?: string;
  isDzoneUser?: boolean;
  isEditing?: boolean;
  onCreateSuccess?: (lineItemId: string) => void;
  onUpdateSuccess?: (updatedData: any) => void;
  loading: boolean;
}

export const FormContainer: FC<IFormContainerProps> = ({
  campaignUuid,
  campaignData,
  tenantCode,
  lineItemId,
  lineItemDetails,
  userId,
  isDzoneUser,
  isEditing,
  onCreateSuccess,
  onUpdateSuccess,
  loading,
}) => {
  const { updateQueryParams } = useUpdateQueryState();
  const [currentStep, setCurrentStep] = useState(0);
  const hasEditCustomFieldsPermission = usePermissionCheck(LineItemActionsEnum.EditCustomFields);

  const handleRedirectAfterCreate = (newLineItemId: string) => {
    onCreateSuccess?.(newLineItemId);
    setCurrentStep(1);
    updateQueryParams(1);
  };

  const savedSteps: { step: number; status: 'processed' }[] = [
    { step: 0, status: 'processed' },
    ...(lineItemId
      ? [
          { step: 1, status: 'processed' as const },
          ...(hasEditCustomFieldsPermission ? [{ step: 2, status: 'processed' as const }] : []),
        ]
      : []),
  ];

  const handleStepperChange = async (key: number) => {
    if (key >= savedSteps.length) {
      return;
    }
    setCurrentStep(key);
    updateQueryParams(key);
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicDetails
            campaignUuid={campaignUuid}
            campaignData={campaignData}
            tenantCode={tenantCode}
            lineItemId={lineItemId}
            lineItemDetails={lineItemDetails}
            userId={userId}
            isDzoneUser={isDzoneUser}
            onCreateSuccess={handleRedirectAfterCreate}
            onUpdateSuccess={onUpdateSuccess}
            nextStep={1}
            handleStepperChange={handleStepperChange}
          />
        );
      case 1:
        return (
          <ValidationSettingsContainer
            lineItemId={lineItemId}
            leadValidationSettingId={lineItemDetails?.validationSettingsId}
            nextStep={hasEditCustomFieldsPermission ? 2 : undefined}
            handleStepperChange={handleStepperChange}
          />
        );
      case 2:
        return <CustomFieldsWrapper lineItemDetails={lineItemDetails} />;
      default:
        return null;
    }
  };
  if (loading && lineItemId) {
    return <ScreenLoader />;
  }
  return (
    <DzBox dzOneBox>
      <Flex vertical gap='0.75rem'>
        <StepsControl
          currentStep={currentStep}
          handleStepperChange={handleStepperChange}
          savedSteps={savedSteps}
        />
        {renderStepComponent()}
      </Flex>
    </DzBox>
  );
};
