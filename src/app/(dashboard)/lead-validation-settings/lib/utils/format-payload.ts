import { DzRecord } from '@/lib/types';

export const formatPayload = (
  values: Record<string, any>,
  enabledRules: Record<string, boolean>,
  selectedValues: Record<string, any>,
  leadValidationSettingConfig: Record<string, any>,
): Record<string, any> => {
  const result: Record<string, any> = { ...values };
  const validations: Record<string, any> = {};

  const enabledRulesKeys = Object.keys(enabledRules).filter((key) => enabledRules[key]);
  for (const rule of enabledRulesKeys) {
    const config = leadValidationSettingConfig[rule];
    if (!config) continue;
    const ruleSections: Record<string, any> = {};
    for (const section of config.sections || []) {
      const sectionName = section.name;
      const selectedSection = selectedValues[sectionName];
      if (!selectedSection) continue;
      // Special handling for targeting/keyword lists
      if (rule === 'TARGETING') {
        if (sectionName === 'TARGETING' || sectionName === 'KEYWORD_LIST') {
          const arr: any[] = [];
          for (const key in selectedSection) {
            const val = selectedSection[key];
            if (val && typeof val === 'object' && val.type && val.data) {
              arr.push({
                name: key,
                type: val.type,
                value:
                  val.type === 'OPTIONS'
                    ? key === 'jobTitle'
                      ? val.data.map((item: DzRecord) => item.text)
                      : val.data
                    : val.data
                        // .filter((item: DzRecord) => item.variant !== 'error')
                        .map((item: DzRecord) => item.id),
              });
            }
          }
          if (arr.length) ruleSections[sectionName] = arr;
        }
        continue;
      }
      if (sectionName === 'LOOPBACK_PERIOD') {
        const arr: any[] = [];
        arr.push({
          name: section?.attributes[0]?.name,
          value: selectedSection[section?.attributes[0]?.name],
        });
        if (arr.length) ruleSections[sectionName] = arr;
        continue;
      }
      // General case: map selectedSection to array of {name, value}
      if (typeof selectedSection === 'object' && !Array.isArray(selectedSection)) {
        const arr: any[] = [];
        for (const key in selectedSection) {
          arr.push({ name: key, value: selectedSection[key] });
        }
        if (arr.length) ruleSections[sectionName] = arr;
      } else if (Array.isArray(selectedSection)) {
        ruleSections[sectionName] = selectedSection;
      } else {
        ruleSections[sectionName] = selectedSection;
      }
    }
    validations[rule] = {
      selected: true,
      sections: ruleSections,
    };
  }
  result.rules = validations;
  return result;
};
