import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { DzRecord } from '@/lib/types';
import { JobTitleTokenType } from '../../campaign-management/line-items/lib/enums';

interface Store {
  isReadOnly: boolean;
  isEditing: boolean;
  setIsEditing: (status: boolean) => void;

  settingMetadata: DzRecord | null;
  setSettingMetadata: (metadata: DzRecord | null) => void;

  activeRule: string | null;
  setActiveRule: (ruleName: string) => void;

  leadValidationSettingInfo: Record<string, string | null> | null;
  setLeadValidationSettingInfo: (
    leadValidationSettingInfo: Record<string, string | null> | null,
  ) => void;

  leadValidationSettingConfig: DzRecord | null;

  processConfigurationResponse: (
    response: DzRecord,
    isEditing: boolean,
    info: Record<string, string | null> | null,
  ) => void;

  selectedValues: DzRecord;
  setSelectedValues: (sectionName: string, values: DzRecord) => void;

  enabledRules: Record<string, boolean>;
  updateRuleSelection: (ruleName: string, selected: boolean) => void;

  targetingSwitchFields: Record<string, boolean>;
  updateTargetingSwitchFields: (name: string, selected: boolean) => void;

  getValidationSettingRules: (type: string) => DzRecord[];
  getValidationSettingRuleSections: () => DzRecord[];
  getValidationSettingRuleSection: (sectionName: string) => DzRecord;

  resetAll: () => void;
}

export const useValidationSettingStore = create<Store>()(
  immer((set, get) => ({
    isReadOnly: false,
    isEditing: false,
    activeRule: null,
    leadValidationSettingInfo: null,
    leadValidationSettingConfig: null,
    selectedValues: {},
    enabledRules: {},
    targetingSwitchFields: {},
    settingMetadata: null,

    setIsEditing: (isEditing: boolean) => {
      set({ isEditing });
    },

    setActiveRule: (ruleName: string) => {
      set({ activeRule: ruleName });
    },

    setLeadValidationSettingInfo: (
      leadValidationSettingInfo: Record<string, string | null> | null,
    ) => set({ leadValidationSettingInfo }),

    processConfigurationResponse: (
      response: DzRecord,
      isEditing: boolean,
      info: Record<string, string | null> | null,
    ) => {
      if (response.isError) {
        return;
      }

      const isReadOnly = info?.tenantCode === 'DEFAULT';

      const rulesList = response.data.rules || [];
      const enabledRules: Record<string, boolean> = {};
      const selectedValues: DzRecord = {};
      const targetingSwitchFields: DzRecord = {};

      const leadValidationSettingConfig: DzRecord = {};
      rulesList.forEach((rule: DzRecord) => {
        enabledRules[rule.name] = rule.selected;
        leadValidationSettingConfig[rule.name as string] = rule;
        rule.sections.forEach((section: DzRecord) => {
          selectedValues[section.name] = {};
          section.attributes.forEach((attribute: DzRecord) => {
            if (section.name === 'TARGETING') {
              targetingSwitchFields[attribute.name] = !!attribute.value;
            }
            if (attribute.value) {
              if (attribute.type === 'select') {
                selectedValues[section.name][attribute.value] = true;
              } else {
                if (attribute.name === 'jobTitle' && attribute.value?.type === 'OPTIONS') {
                  selectedValues[section.name][attribute.name] = {
                    data: attribute.value.data.map((jobTitle: string) => ({
                      text: jobTitle,
                      type: JobTitleTokenType.UserEntered,
                    })),
                    type: 'OPTIONS',
                  };
                } else {
                  selectedValues[section.name][attribute.name] = attribute.value;
                }
              }
            }
          });
        });
      });

      set({
        isReadOnly,
        activeRule: null,
        leadValidationSettingConfig,
        enabledRules,
        selectedValues,
        targetingSwitchFields,
      });

      if (isEditing && info) {
        if (info.tenantCode && info.leadValidationSettingId && !info.lineItemId) {
          set({
            settingMetadata: {
              name: response.data.name,
              tenantCode: response.data.tenantCode,
              id: response.data.id,
              lineItemId: null,
            },
          });
        } else if (!info.tenantCode && info.leadValidationSettingId && info.lineItemId) {
          set({
            settingMetadata: {
              name: response.data.name,
              tenantCode: response.data.tenantCode,
              id: response.data.id,
              lineItemId: info.lineItemId,
            },
          });
        }
      }
    },

    setSettingMetadata: (settingMetadata: DzRecord | null) => {
      set({ settingMetadata });
    },

    setSelectedValues: (sectionName: string, values: DzRecord) => {
      const { selectedValues } = get();
      selectedValues[sectionName] = values;
      set({ selectedValues: { ...selectedValues } });
    },

    getValidationSettingRules: (type: string) => {
      const { leadValidationSettingConfig } = get();
      if (!leadValidationSettingConfig) {
        return [];
      }
      return Object.values(leadValidationSettingConfig)
        .filter((rule) => rule.type === type)
        .map((rule) => {
          return {
            name: rule.name,
            label: rule.label,
          };
        });
    },

    getValidationSettingRuleSections: () => {
      const { leadValidationSettingConfig, activeRule } = get();
      if (!leadValidationSettingConfig || !activeRule) {
        return [];
      }
      return (
        leadValidationSettingConfig[activeRule]?.sections?.map((section: DzRecord) => ({
          name: section.name,
          noBorder: section.noBorder,
        })) || []
      );
    },

    getValidationSettingRuleSection: (sectionName: string) => {
      const { leadValidationSettingConfig, activeRule } = get();
      if (!leadValidationSettingConfig || !activeRule) {
        return {};
      }
      const sections = leadValidationSettingConfig[activeRule]?.sections || [];
      return sections.find((section: DzRecord) => section.name === sectionName) || {};
    },

    updateRuleSelection: (ruleName: string, selected: boolean) => {
      const { enabledRules } = get();
      enabledRules[ruleName] = selected;
      set({ enabledRules: { ...enabledRules } });
    },

    updateTargetingSwitchFields(name, selected) {
      const { targetingSwitchFields } = get();
      targetingSwitchFields[name] = selected;
      set({ targetingSwitchFields: { ...targetingSwitchFields } });
    },

    resetAll: () => {
      set({
        leadValidationSettingInfo: null,
        leadValidationSettingConfig: null,
        isEditing: false,
        activeRule: null,
        selectedValues: {},
        enabledRules: {},
        settingMetadata: null,
      });
    },
  })),
);
