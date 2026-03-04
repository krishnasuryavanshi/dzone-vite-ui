import { useEffect } from 'react';
import { useValidationSettingStore } from '../../store';
import { ValidationSettingsTabs } from './validation-settings-tabs';

export const ValidationsSettingsContainer = () => {
  const { leadValidationSettingConfig, setActiveRule, getValidationSettingRules } =
    useValidationSettingStore();

  useEffect(() => {
    if (leadValidationSettingConfig) {
      const rules = getValidationSettingRules('Validations');
      if (rules.length > 0) {
        setActiveRule(rules[0].name);
      }
    }
  }, [leadValidationSettingConfig]);
  return <ValidationSettingsTabs />;
};
