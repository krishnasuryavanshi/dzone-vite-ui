import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { useValidationSettingStore } from '../../store';
import { ValidationSettingRuleSectionInput } from './validation-setting-rule-section-input';
import { useEffect, useState } from 'react';
import { DzRecord } from '@/lib/types';

type ValidationSettingRuleSectionProps = {
  name?: string;
  noBorder?: boolean;
};

export const ValidationSettingRuleSection = ({
  name,
  noBorder = false,
}: ValidationSettingRuleSectionProps) => {
  const [leadValidationSettingSection, setLeadValidationSettingSection] =
    useState<DzRecord | null>(null);
  const {
    leadValidationSettingConfig,
    activeRule,
    getValidationSettingRuleSection,
  } = useValidationSettingStore();

  useEffect(() => {
    if (!leadValidationSettingConfig || !activeRule) {
      return;
    }
    if (!name) {
      setLeadValidationSettingSection(null);
      return;
    }
    const section = getValidationSettingRuleSection(name);
    // An empty object is returned if the section is not found.
    // We need to check for this case.
    if (!section || Object.keys(section).length === 0) {
      setLeadValidationSettingSection(null);
      return;
    }
    setLeadValidationSettingSection(section);
  }, [leadValidationSettingConfig, activeRule, name]);

  if (!leadValidationSettingSection) {
    return null;
  }

  return (
    <Flex vertical gap={'0.75rem'} style={{ marginBottom: '3rem' }}>
      <DzBox>
        <Text style={{ color: '#95989A', fontWeight: 700 }}>
          {leadValidationSettingSection.description}
        </Text>
      </DzBox>
      <DzBox
        style={
          noBorder
            ? {}
            : {
                borderRadius: '5px',
                border: '1px solid #EAF1FF',
              }
        }>
        <ValidationSettingRuleSectionInput
          section={leadValidationSettingSection}
        />
      </DzBox>
    </Flex>
  );
};
