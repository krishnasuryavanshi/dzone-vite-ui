'use client';
import { DzBox } from '@/components/layout/v1';
import { Hideable, MapFunction } from '@/components/shared';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents';
import React, { PropsWithChildren, useState } from 'react';
import { HasPermission } from '@/components/auth';
import { LineItemActionsEnum } from '@/lib/enums/permissions';
import { useValidationSettingStore } from '@/app/(dashboard)/lead-validation-settings/store';
import { showNotification } from '@/services';
import {
  ValidationEditDrawer,
  EditConfig,
} from '../../edit-drawer/validation-edit-drawer';
import { EditICon } from '@/uicomponents/icons/svgs';
import { VALIDATION_LABEL_MAP } from '@/app/(dashboard)/campaign-management/lib/constants/validation-label-map';
import { updateLineItemsLeadValidationSettingRule } from '@/app/(dashboard)/lead-validation-settings/services';
import { CustomTooltip } from './show-targeting-attributes/custom-tooltip';

interface RuleContainerProps extends PropsWithChildren {
  header: string;
  extra?: string[];
  ruleName: string;
  editComponent?: React.ReactNode;
  showEditButton?: boolean;
  editConfig?: EditConfig;
}

export const RuleContainer = ({
  header,
  extra = [],
  children,
  ruleName,
  editComponent,
  showEditButton = true,
  editConfig = {},
}: RuleContainerProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeRuleName, setActiveRuleName] = useState('');
  const [copiedCount, setCopiedCount] = useState<number | null>(null);

  const configRuleName = VALIDATION_LABEL_MAP[ruleName] || ruleName;

  const { leadValidationSettingConfig, setActiveRule } =
    useValidationSettingStore();

  const handleEdit = () => {
    if (!leadValidationSettingConfig?.[ruleName]) {
      return;
    }

    setActiveRule(ruleName);
    setActiveRuleName(ruleName);

    const ruleConfig = leadValidationSettingConfig[ruleName];
    const { setSelectedValues } = useValidationSettingStore.getState();

    if (ruleConfig && ruleConfig.sections) {
      // Iterate through all sections of the rule
      ruleConfig.sections.forEach((section: any) => {
        const sectionData: Record<string, any> = {};

        if (section.attributes) {
          section.attributes.forEach((attr: any) => {
            // Check if the attribute has a value set to true or has complex value
            if (attr.value === true) {
              sectionData[attr.name] = true;
            } else if (attr.value && typeof attr.value === 'object') {
              // For complex values like in TARGETING rule
              sectionData[attr.name] = attr.value;
            } else if (
              attr.value !== false &&
              attr.value !== null &&
              attr.value !== undefined
            ) {
              // For other non-false values
              sectionData[attr.name] = attr.value;
            }
          });
        }
        setSelectedValues(section.name, sectionData);
      });
    }

    setEditedData({});

    setIsDrawerOpen(true);
  };

  const handleCopy = () => {
    const res = leadValidationSettingConfig?.[ruleName];
    const dataToCopy =
      res?.sections?.[0]?.attributes
        ?.filter((attr: any) => attr.value)
        ?.map((attr: any) => attr.label || '') || [];

    if (!dataToCopy) {
      showNotification({
        message: 'No data to copy.',
      });
      return;
    }

    let values: string[] = [];

    if (dataToCopy.data && Array.isArray(dataToCopy.data)) {
      values = dataToCopy.data.map((item: any) =>
        typeof item === 'object' && item.text ? item.text : item,
      );
    } else if (typeof dataToCopy === 'boolean') {
      values = [configRuleName];
    } else if (Array.isArray(dataToCopy)) {
      values = dataToCopy;
    }

    // Map IDs → labels if available
    if (values.length > 0 && leadValidationSettingConfig?.[ruleName]) {
      const res = leadValidationSettingConfig[ruleName];
      const fieldLabels =
        res?.sections?.[0]?.attributes?.map((attr: any) => ({
          id: attr.value,
          label: attr.label,
        })) || [];

      values = values.map(
        (val) => fieldLabels.find((f: any) => f.id === val)?.label || val,
      );
    }

    if (values.length === 0) {
      showNotification({
        message: 'No values to copy.',
      });
      return;
    }

    const textToCopy = values.join(', ');

    navigator.clipboard.writeText(textToCopy).then(
      () => {
        setCopiedCount(values.length);
        setTimeout(() => setCopiedCount(null), 2000); // reset after 2s
      },
      () => {
        setCopiedCount(null);
      },
    );
  };

  const handleSave = async () => {
    // Get lineItemId and validationSettingsId from the validation settings store
    const { leadValidationSettingInfo } = useValidationSettingStore.getState();

    if (
      !leadValidationSettingInfo?.lineItemId ||
      !leadValidationSettingInfo?.leadValidationSettingId
    ) {
      return;
    }
    setIsLoading(true);
    try {
      if (!activeRuleName) {
        showNotification({
          message: 'No active rule selected',
          type: 'error',
        });
        return;
      }

      let dataToSave: any;
      let attributes: any[] = [];

      // Special handling for DUPLICATE_VALIDATION which has multiple sections
      if (activeRuleName === 'DUPLICATE_VALIDATION') {
        // Get the latest values from the store's selectedValues
        const { selectedValues: currentSelectedValues } =
          useValidationSettingStore.getState();
        const sections: Record<string, any[]> = {};

        // Process each section in the duplicate validation config
        const ruleSections =
          leadValidationSettingConfig?.[activeRuleName]?.sections || [];

        for (const section of ruleSections) {
          const sectionName = section.name;
          const sectionAttributes = section.attributes || [];

          if (sectionName === 'LOOPBACK_PERIOD') {
            // Handle numeric field - always include this section
            const sectionData = currentSelectedValues[sectionName] || {};
            const lookbackField = sectionAttributes[0];
            if (lookbackField) {
              const lookbackValue = sectionData[lookbackField.name];
              sections[sectionName] = [
                {
                  name: lookbackField.name,
                  value:
                    lookbackValue !== undefined &&
                    lookbackValue !== null &&
                    lookbackValue !== ''
                      ? lookbackValue
                      : null,
                },
              ];
            }
          } else {
            // Handle checkbox fields - always include section, even if no selected values
            const sectionData = currentSelectedValues[sectionName] || {};
            const processedAttributes = sectionAttributes.map((field: any) => ({
              name: field.name,
              value: sectionData[field.name] === true,
            }));

            // Always include the section
            sections[sectionName] = processedAttributes;
          }
        }

        const requestData = {
          rules: {
            [activeRuleName]: {
              selected: true,
              sections: sections,
            },
          },
        };

        await updateLineItemsLeadValidationSettingRule(
          leadValidationSettingInfo.lineItemId,
          leadValidationSettingInfo.leadValidationSettingId,
          ruleName,
          requestData,
        );

        showNotification({
          message: 'Validation settings updated successfully',
          type: 'success',
        });

        // Refresh the validation settings data
        const { fetchConfiguration } = useValidationSettingStore.getState();
        await fetchConfiguration();

        setIsDrawerOpen(false);
        setIsLoading(false);
        return; // Exit early
      }
      // Handle other checkbox-based validations
      else if (
        [
          'MANDATORY_VALIDATION',
          'SYNTAX_VALIDATION',
          'INTEGRITY_VALIDATION',
        ].includes(activeRuleName)
      ) {
        // Get the actual section name from config (e.g., MANDATORY_FIELDS)
        const sectionName =
          leadValidationSettingConfig?.[activeRuleName]?.sections?.[0]?.name;

        // Get the latest values from the store's selectedValues for this section
        // The ValidationRuleCheckboxGroup updates selectedValues[sectionName]
        const { selectedValues: currentSelectedValues } =
          useValidationSettingStore.getState();
        dataToSave = currentSelectedValues[sectionName] || {};

        // Get all possible fields from the config
        const allFields =
          leadValidationSettingConfig?.[activeRuleName]?.sections?.[0]
            ?.attributes || [];

        attributes = allFields.map((field: any) => ({
          name: field.name,
          value: dataToSave[field.name] === true, // Ensure false is sent if not true
        }));

        // Update the request data structure to use the actual section name
        const requestData = {
          rules: {
            [activeRuleName]: {
              selected: true,
              sections: {
                [sectionName || activeRuleName]: attributes,
              },
            },
          },
        };

        await updateLineItemsLeadValidationSettingRule(
          leadValidationSettingInfo.lineItemId,
          leadValidationSettingInfo.leadValidationSettingId,
          ruleName,
          requestData,
        );

        showNotification({
          message: 'Validation settings updated successfully',
          type: 'success',
        });

        // Refresh the validation settings data
        const { fetchConfiguration } = useValidationSettingStore.getState();
        await fetchConfiguration();

        setIsDrawerOpen(false);
        setIsLoading(false);
        return; // Exit early for these rule types
      }
      // For rules with radio selections (EMAIL_VALIDATION, TARGETING_VALIDATION, OPT_IN_VALIDATION)
      else if (
        [
          'EMAIL_VALIDATION',
          'TARGETING_VALIDATION',
          'OPT_IN_VALIDATION',
        ].includes(activeRuleName)
      ) {
        // Get the section name and values from store
        const { selectedValues: currentSelectedValues } =
          useValidationSettingStore.getState();
        const sectionName =
          leadValidationSettingConfig?.[activeRuleName]?.sections?.[0]?.name;
        dataToSave = currentSelectedValues[sectionName || activeRuleName] || {};

        // These typically have a single selected value
        attributes = Object.entries(dataToSave).map(([key, value]) => ({
          name: key,
          value: value,
        }));
      }
      // Default handler for other rule types
      else {
        // Get the section name and values from store
        const { selectedValues: currentSelectedValues } =
          useValidationSettingStore.getState();
        const sectionName =
          leadValidationSettingConfig?.[activeRuleName]?.sections?.[0]?.name;
        dataToSave = currentSelectedValues[sectionName || activeRuleName] || {};

        attributes = Object.entries(dataToSave).map(([key, value]) => ({
          name: key,
          value: value,
        }));
      }

      const requestData = {
        rules: {
          [activeRuleName]: {
            selected: true,
            sections: {
              [activeRuleName]: attributes,
            },
          },
        },
      };
      await updateLineItemsLeadValidationSettingRule(
        leadValidationSettingInfo.lineItemId,
        leadValidationSettingInfo.leadValidationSettingId,
        ruleName,
        requestData,
      );

      showNotification({
        message: 'Validation settings updated successfully',
        type: 'success',
      });

      // Refresh the validation settings data
      const { fetchConfiguration } = useValidationSettingStore.getState();
      await fetchConfiguration();

      setIsDrawerOpen(false);
    } catch (error) {
      showNotification({
        message: 'Failed to update validation settings',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsDrawerOpen(false);
    setEditedData({});
    setActiveRule('');
    setActiveRuleName('');
  };

  const renderExtraContent = (item: string) => (
    <DzBox
      style={{
        background: '#EAF1FF',
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
      }}>
      <Text
        style={{
          color: '#235AED',
          fontSize: '0.75rem',
          fontWeight: 600,
          lineHeight: '1rem',
        }}>
        {item}
      </Text>
    </DzBox>
  );

  return (
    <>
      <DzBox
        style={{
          backgroundColor: '#FFFFFF',
          border: ruleName !== 'TARGETING' ? '1px solid #E5E7EB' : 'none',
          borderRadius: ruleName !== 'TARGETING' ? '8px' : 'none',
          position: 'relative',
        }}>
        {/* Header Section - Hidden for TARGETING as it has its own section header */}
        {ruleName !== 'TARGETING' && (
          <DzBox
            style={{
              padding: '0.75rem 1rem',
              borderBottom: children ? '1px solid #E5E7EB' : 'none',
            }}>
            <Flex justify='space-between' align='center'>
              <Flex align='center' gap={'0.5rem'}>
                <Text
                  style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    lineHeight: '1.25rem',
                  }}>
                  {header}
                </Text>
                <Hideable show={extra?.length > 0}>
                  <Flex gap={'0.375rem'}>
                    <MapFunction
                      items={extra}
                      renderItem={renderExtraContent}
                    />
                  </Flex>
                </Hideable>
              </Flex>
              <Flex gap='0.5rem' align='center'>
                {copiedCount !== null && (
                  <Text style={{ fontSize: '0.75rem', color: '#34C759' }}>
                    {copiedCount} records copied!
                  </Text>
                )}
                {showEditButton && (
                  <HasPermission
                    permissions={[LineItemActionsEnum.EditValidationSettings]}>
                    <CustomTooltip title='Edit'>
                      <DzBox
                        style={{
                          backgroundColor: '#fff',
                          borderRadius: '5px',
                          padding: '0.25rem 0.5rem',
                          border: '1px solid #ddd',
                          cursor: 'pointer',
                        }}
                        onClick={handleEdit}>
                        <EditICon />
                      </DzBox>
                    </CustomTooltip>
                  </HasPermission>
                )}
              </Flex>
            </Flex>
          </DzBox>
        )}

        {/* Edit button for TARGETING - positioned absolutely in top right */}
        {ruleName === 'TARGETING' && showEditButton && (
          <HasPermission
            permissions={[LineItemActionsEnum.EditValidationSettings]}>
            <DzBox
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                zIndex: 1,
              }}>
              <CustomTooltip title='Edit'>
                <DzBox
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                    padding: '0.25rem 0.5rem',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                  }}
                  onClick={handleEdit}>
                  <EditICon />
                </DzBox>
              </CustomTooltip>
            </DzBox>
          </HasPermission>
        )}

        {/* Content Section */}
        <Hideable show={!!children}>
          <DzBox
            style={{
              padding: ruleName !== 'TARGETING' ? '0.75rem 1rem' : '0',
            }}>
            {children}
          </DzBox>
        </Hideable>
      </DzBox>

      <ValidationEditDrawer
        isOpen={isDrawerOpen}
        onClose={handleClose}
        title={header}
        isLoading={isLoading}
        onSave={handleSave}
        ruleName={activeRuleName}
        editConfig={editConfig}
        editedData={editedData}
        setEditedData={setEditedData}
      />
    </>
  );
};
