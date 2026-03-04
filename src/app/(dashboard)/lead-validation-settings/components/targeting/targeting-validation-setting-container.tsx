import { useEffect } from 'react';
import { useValidationSettingStore } from '../../store';
import { TargetingValidationSettingSections } from './targeting-validation-setting-sections';

export const TargetingValidationSettingContainer = () => {
  const { leadValidationSettingConfig, activeRule, setActiveRule, getValidationSettingRules } =
    useValidationSettingStore();

  useEffect(() => {
    if (leadValidationSettingConfig) {
      const rules = getValidationSettingRules('Targeting');
      if (rules.length > 0) {
        setActiveRule(rules[0].name);
      }
    }
  }, [leadValidationSettingConfig]);

  if (!activeRule) {
    return null;
  }

  return <TargetingValidationSettingSections />;
};
