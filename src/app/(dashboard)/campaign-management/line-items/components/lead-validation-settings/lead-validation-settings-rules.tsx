import { useValidationSettingStore } from '@/app/(dashboard)/lead-validation-settings/store';
import { DzBox } from '@/components/layout/v1';
import { MapFunction } from '@/components/shared';
import { Text } from '@/uicomponents/text';
import { Flex } from '@/uicomponents/layout';
import React from 'react';
import { LeadValidationSettingRuleContainer } from './lead-validation-setting-rule-container';

type LeadValidationSettingsRulesProps = {
  isEditing?: boolean;
};

export const LeadValidationSettingsRules = ({
  isEditing,
}: LeadValidationSettingsRulesProps) => {
  const { leadValidationSettingConfig } = useValidationSettingStore();

  const renderValidationRule = (rule: string) => {
    return (
      <DzBox
        key={rule}
        style={{
          boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25) inset',
          marginBlock: '0.5rem',
          borderRadius: '8px',
        }}>
        <LeadValidationSettingRuleContainer
          ruleName={rule}
          isEditing={isEditing}
        />
      </DzBox>
    );
  };

  if (!leadValidationSettingConfig) {
    return null;
  }

  // Define targeting and validation rules
  const targetingRules = ['TARGETING'];
  const validationRules = [
    'MANDATORY_VALIDATION',
    'DUPLICATE_VALIDATION',
    'SYNTAX_VALIDATION',
    'OPT_IN_VERIFICATION',
    'LOOKBACK_PERIOD',
    'EMAIL_VALIDATION',
  ];

  const allRules = Object.keys(leadValidationSettingConfig) || [];

  const hasEnabledTargetingAttributes =
    leadValidationSettingConfig.TARGETING?.sections?.some((section: any) =>
      section.attributes?.some((attribute: any) => {
        const { value } = attribute;
        // Case 1: Value is a simple truthy value (like true, a number, or a non-empty string)
        if (!!value && typeof value !== 'object') {
          return true;
        }

        // Case 2: Value is an array with items
        if (Array.isArray(value) && value.length > 0) {
          return true;
        }

        // Case 3: Value is an object with type and non-empty data array (as you suggested)
        if (
          value &&
          value.type &&
          Array.isArray(value.data) &&
          value.data.length > 0
        ) {
          return true;
        }

        return false;
      }),
    );

  const targetingRulesToRender = allRules.filter((rule) =>
    targetingRules.includes(rule),
  );
  const validationRulesToRender = allRules.filter(
    (rule) => validationRules.includes(rule) || !targetingRules.includes(rule),
  );

  return (
    <Flex vertical gap='0.5rem'>
      {/* Targeting Section */}
      {hasEnabledTargetingAttributes && targetingRulesToRender.length > 0 && (
        <DzBox>
          <Text
            strong
            style={{
              fontSize: '1rem',
              marginBottom: '0.5rem',
              display: 'block',
            }}>
            Targeting
          </Text>
          <MapFunction
            items={targetingRulesToRender}
            renderItem={renderValidationRule}
          />
        </DzBox>
      )}

      {/* Validations Section */}
      {validationRulesToRender.length > 0 && (
        <DzBox>
          <Text
            strong
            style={{
              fontSize: '1rem',
              marginBottom: '0.5rem',
              display: 'block',
            }}>
            Validations
          </Text>
          <MapFunction
            items={validationRulesToRender}
            renderItem={renderValidationRule}
          />
        </DzBox>
      )}
    </Flex>
  );
};
