import { useEffect, useState } from 'react';
import { useValidationSettingStore } from '../../store';
import {
  ValidationRuleCheckboxGroup,
  ValidationRuleDropdown,
  ValidationRuleNumberInput,
  ValidationRuleRadioGroup,
  ValidationRuleSwitch,
} from './inputs';

type ValidationSettingRuleSectionInputProps = {
  section: Record<string, any>;
};

export const ValidationSettingRuleSectionInput = ({
  section,
}: ValidationSettingRuleSectionInputProps) => {
  const { activeRule, enabledRules, isReadOnly } = useValidationSettingStore();
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (
      !isReadOnly &&
      enabledRules?.[activeRule as keyof typeof enabledRules]
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [activeRule, enabledRules]);

  switch (section.attributes[0].type) {
    case 'radio':
      return (
        <ValidationRuleRadioGroup section={section} isDisabled={isDisabled} />
      );
    case 'select':
      return (
        <ValidationRuleDropdown section={section} isDisabled={isDisabled} />
      );
    case 'number':
      return (
        <ValidationRuleNumberInput section={section} isDisabled={isDisabled} />
      );
    case 'checkbox':
      return (
        <ValidationRuleCheckboxGroup
          section={section}
          isDisabled={isDisabled}
        />
      );
    case 'switch':
      return <ValidationRuleSwitch section={section} isDisabled={isDisabled} />;
    default:
      return null;
  }
};
