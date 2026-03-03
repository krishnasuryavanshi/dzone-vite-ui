import { DzBox } from '@/components/layout/v1';
import { CreateValidationSettingHeader } from './create-validation-setting-header';
import { Flex } from '@/uicomponents/layout';
import { ValidationSettingTabsContainer } from './validation-setting-tabs-container';

import './create-validation-setting.scss';

type CreateValidationSettingContainerProps = {
  isEditing: boolean;
  tenantCode?: string;
  leadValidationSettingId?: string;
  lineItemId?: string;
};

export const CreateValidationSettingContainer = ({
  isEditing,
  tenantCode,
  lineItemId,
  leadValidationSettingId,
}: CreateValidationSettingContainerProps) => {
  return (
    <DzBox className='dz-page-content create-validation-setting'>
      <Flex vertical gap={'1rem'} style={{ height: '100%' }}>
        <CreateValidationSettingHeader isEditing={isEditing} />
        <DzBox style={{ flex: 1 }}>
          <ValidationSettingTabsContainer
            isEditing={isEditing}
            tenantCode={tenantCode}
            lineItemId={lineItemId}
            leadValidationSettingId={leadValidationSettingId}
          />
        </DzBox>
      </Flex>
    </DzBox>
  );
};
