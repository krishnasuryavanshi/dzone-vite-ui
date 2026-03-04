import { DzBox } from '@/components/layout/v1';
import { TabsProps } from '@/lib/types/uicomponents';
import { Tabs } from '@/uicomponents/tabs';
import React, { useEffect, useMemo } from 'react';
import { ValidationsSettingsContainer } from './validations';
import { Hideable } from '@/components/shared';
import { TargetingValidationSettingContainer } from './targeting';
import { useValidationSettingStore } from '../store';
import { useValidationSettingConfigQuery } from '../hooks';
import { Flex } from '@/uicomponents/layout';
import { ValidationSettingsActions } from './validation-settings-actions';

type ValidationSettingTabsContainerProps = {
  isEditing?: boolean;
  tenantCode?: string;
  lineItemId?: string;
  leadValidationSettingId?: string;
};

export const ValidationSettingTabsContainer = ({
  isEditing,
  tenantCode,
  lineItemId,
  leadValidationSettingId,
}: ValidationSettingTabsContainerProps) => {
  const [activeTab, setActiveTab] = React.useState<'targeting' | 'validations'>('targeting');

  const {
    setIsEditing,
    setLeadValidationSettingInfo,
    processConfigurationResponse,
    leadValidationSettingInfo,
    leadValidationSettingConfig,
  } = useValidationSettingStore();

  useEffect(() => {
    if (isEditing && leadValidationSettingId && tenantCode) {
      setIsEditing(isEditing);
      setLeadValidationSettingInfo({ leadValidationSettingId, tenantCode });
    } else if (isEditing && leadValidationSettingId && lineItemId) {
      setIsEditing(isEditing);
      setLeadValidationSettingInfo({ leadValidationSettingId, lineItemId });
    } else {
      setIsEditing(false);
      setLeadValidationSettingInfo(null);
    }
  }, [isEditing, leadValidationSettingId, tenantCode, lineItemId]);

  const queryEnabled = useMemo(() => {
    if (!isEditing) return true;
    return !!leadValidationSettingInfo;
  }, [isEditing, leadValidationSettingInfo]);

  const { data: configResponse } = useValidationSettingConfigQuery(
    !!isEditing,
    leadValidationSettingInfo,
    queryEnabled,
  );

  useEffect(() => {
    if (configResponse) {
      processConfigurationResponse(configResponse, !!isEditing, leadValidationSettingInfo);
    }
  }, [configResponse]);

  const handleTabChange = (key: string) => {
    setActiveTab(key as 'targeting' | 'validations');
  };

  const items: TabsProps['items'] = [
    {
      key: 'targeting',
      label: 'Targeting',
    },
    {
      key: 'validations',
      label: 'Validations',
    },
  ];

  return (
    <DzBox dzOneBox style={{ padding: 0, height: '100%' }}>
      <DzBox
        style={{
          padding: '2rem',
          paddingTop: '1rem',
          paddingBottom: 0,
          borderBottom: '1px solid #e8e8e8',
        }}
      >
        <Tabs
          activeKey={activeTab}
          items={items}
          onChange={handleTabChange}
          destroyInactiveTabPane
        />
      </DzBox>
      <DzBox
        style={{
          padding: '1rem 0 1rem 0',
        }}
      >
        <Hideable show={activeTab === 'targeting' && !!leadValidationSettingConfig}>
          <TargetingValidationSettingContainer />
        </Hideable>
        <Hideable show={activeTab === 'validations' && !!leadValidationSettingConfig}>
          <ValidationsSettingsContainer />
        </Hideable>
      </DzBox>
      <DzBox
        style={{
          position: 'fixed',
          bottom: '1rem',
          padding: '1rem',
          right: '2rem',
        }}
      >
        <Flex justify='flex-end'>
          <ValidationSettingsActions />
        </Flex>
      </DzBox>
    </DzBox>
  );
};
