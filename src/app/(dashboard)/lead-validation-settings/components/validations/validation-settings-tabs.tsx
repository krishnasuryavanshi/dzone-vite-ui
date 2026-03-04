import { DzBox } from '@/components/layout/v1';
import { TabsProps } from '@/lib/types/uicomponents';
import { Tabs } from '@/uicomponents/tabs';
import { useEffect, useState } from 'react';
import { useValidationSettingStore } from '../../store';
import { ValidationSettingTabItem } from './validation-setting-tab-item';
import { ValidationSettingTabItemContent } from './validation-setting-tab-item-content';

export const ValidationSettingsTabs = () => {
  const [leadValidationRulesList, setLeadValidationRulesList] = useState<TabsProps['items']>([]);
  const { getValidationSettingRules, setActiveRule, activeRule, isReadOnly } =
    useValidationSettingStore();

  useEffect(() => {
    const rules = getValidationSettingRules('Validations');
    if (rules.length > 0) {
      setLeadValidationRulesList(
        rules.map((rule) => ({
          key: rule.name,
          label: (
            <ValidationSettingTabItem name={rule.name} label={rule.label} disabled={isReadOnly} />
          ),
          children: <ValidationSettingTabItemContent />,
        })),
      );
    } else {
      setLeadValidationRulesList([]);
    }
  }, [getValidationSettingRules]);

  return (
    <DzBox style={{ paddingInline: '0.75rem 2rem' }}>
      <Tabs
        tabPosition='left'
        destroyInactiveTabPane
        items={leadValidationRulesList}
        onChange={(key) => setActiveRule(key)}
        activeKey={activeRule || undefined}
        style={{ height: '100%' }}
      />
    </DzBox>
  );
};
