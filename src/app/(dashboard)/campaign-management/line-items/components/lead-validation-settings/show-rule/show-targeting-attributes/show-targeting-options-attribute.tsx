import { DzBox } from '@/components/layout/v1';
import { DzRecord } from '@/lib/types';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { DrawerShowList } from '@/components/shared/text/drawer-list-view';
import { MapFunction } from '@/components/shared';
import { EditICon } from '@/uicomponents/icons/svgs';
import { ValidationEditDrawer } from '../../../edit-drawer/validation-edit-drawer';
import { CopyPasteIcon } from '@/uicomponents/icons/svgs';
import { showNotification } from '@/services/notification';
import { updateLineItemsLeadValidationSettingAttribute } from '../../../../../../lead-validation-settings/services';
import { useValidationSettingStore } from '../../../../../../lead-validation-settings/store';
import { CustomTooltip } from './custom-tooltip';
import { LineItemActionsEnum } from '@/lib/enums/permissions';
import { HasPermission } from '@/components/auth';
import { EyeOutlined } from '@ant-design/icons';
import { Tag } from '@/uicomponents/tag';
import { TruncatedTagList } from '../components/truncated-tag-list';

type ShowTargetingOptionsAttributeProps = {
  name: string;
  label: string;
  options: DzRecord[];
  values: string[];
  attributeId: string; // Add attribute ID prop
  onUpdate?: (newValues: string[]) => void; // Callback to update parent state
  isEditing?: boolean;
};

const DrawerItemStyle = {
  padding: '0.5rem',
  borderRadius: '5px',
  border: '1px solid #D3E3EE',
};

export const ShowTargetingOptionsAttribute = ({
  name,
  label,
  options,
  values,
  attributeId,
  onUpdate,
  isEditing = false,
}: ShowTargetingOptionsAttributeProps) => {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<any>({ selectedValues: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCount, setCopiedCount] = useState<number | null>(null);
  const [currentValues, setCurrentValues] = useState<string[]>(values);

  const getEditConfig = (attributeName: string) => {
    const isRevenueOrEmployee = ['revenueSize', 'employeeSize'].includes(
      attributeName,
    );
    const isCountry = attributeName === 'country';

    const editorOptions = options.map((option) => ({
      id: option.value,
      label: option.label || option.value,
    }));

    if (isRevenueOrEmployee || isCountry) {
      return {
        type: 'list-selection',
        props: {
          predefinedOptions: editorOptions,
          showSearch: isCountry,
          allowCustomRange: isRevenueOrEmployee,
        },
      };
    }

    return {
      type: 'chips',
      props: {
        predefinedOptions: editorOptions,
      },
    };
  };

  const editConfig = getEditConfig(name);

  useEffect(() => {
    setCurrentValues(values);
  }, [values]);

  // Initialize editedData only when component mounts or when values change from parent
  useEffect(() => {
    // Only update if drawer is not open (to preserve user's unsaved changes)
    if (!isEditDrawerOpen) {
      let selectedValuesForEditor;

      if (editConfig.type === 'list-selection') {
        // ListSelectionEdit expects a flat array of strings (the values)
        selectedValuesForEditor = currentValues;
      } else {
        // ChipsEdit expects an array of {id, label} objects
        selectedValuesForEditor = currentValues.map((value) => {
          const option = options.find((opt) => opt.value === value);
          return {
            id: value,
            label: option ? option.label : value,
          };
        });
      }

      setEditedData({
        selectedValues: selectedValuesForEditor,
      });
    }
  }, [options, currentValues, editConfig.type, isEditDrawerOpen]);

  const handleEdit = () => {
    setIsEditDrawerOpen(true);
  };

  const handleClose = () => {
    setIsEditDrawerOpen(false);
    // Reset edited data to original values when closing without saving
    let selectedValuesForEditor;
    if (editConfig.type === 'list-selection') {
      selectedValuesForEditor = currentValues;
    } else {
      selectedValuesForEditor = currentValues.map((value) => {
        const option = options.find((opt) => opt.value === value);
        return {
          id: value,
          label: option ? option.label : value,
        };
      });
    }
    setEditedData({
      selectedValues: selectedValuesForEditor,
    });
  };

  const handleCopy = () => {
    const dataToCopy = editedData;
    if (!dataToCopy) {
      showNotification({
        message: 'No data to copy.',
      });
      return;
    }

    if (currentValues.length === 0) {
      showNotification({
        message: 'No values to copy.',
      });
      return;
    }

    const textToCopy = currentValues.join(', ');

    navigator.clipboard.writeText(textToCopy).then(
      () => {
        setCopiedCount(currentValues.length);
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
      showNotification({
        message: 'Missing line item or validation settings information',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Normalize editedData into an array of string values
      let normalizedValues: string[] = [];
      if (editConfig.type === 'list-selection') {
        // Already strings
        normalizedValues = editedData.selectedValues;
      } else {
        // Chips → extract IDs
        normalizedValues = editedData.selectedValues.map((item: any) =>
          typeof item === 'string' ? item : item.id,
        );
      }

      const requestData = {
        attribute: {
          type: 'OPTIONS', // since you are handling targeting attributes
          value: normalizedValues,
        },
      };

      await updateLineItemsLeadValidationSettingAttribute(
        leadValidationSettingInfo.lineItemId,
        leadValidationSettingInfo.leadValidationSettingId,
        attributeId, // Use the attribute ID instead of name
        requestData,
      );

      showNotification({ message: 'Saved successfully!', type: 'success' });

      // Update local state with new values
      setCurrentValues(normalizedValues);

      // Refresh the validation settings data from the backend
      await queryClient.invalidateQueries({ queryKey: queryKeys.validationSettings.all });

      // Call parent callback if provided
      if (onUpdate) {
        onUpdate(normalizedValues);
      }

      setIsEditDrawerOpen(false);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const renderValueOption = (value: string) => {
    const option = options.find((opt) => opt.value === value);
    return (
      <Tag
        key={value}
        style={{
          backgroundColor: '#EAF1FF',
          border: 'none',
          borderRadius: '0.625rem',
          padding: '0.31rem 0.63rem',
          fontSize: '0.875rem',
          fontFamily: 'Roboto',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: 'normal',
          color: '#707070',
          height: '1.5rem',
        }}>
        {option ? option.label : value}
      </Tag>
    );
  };

  return (
    <>
      <DzBox>
        <Flex
          justify='space-between'
          align='flex-start'
          style={{
            backgroundColor: '#F9FAFB',
            borderRadius: '10px',
            padding: '0.5rem',
            margin: '0.5rem 0.75rem',
          }}>
          <DzBox style={{ flex: 1 }}>
            <Flex vertical gap='0.5rem'>
              <Text strong style={{ fontSize: '0.875rem' }}>
                {label}{' '}
                <span style={{ fontWeight: 400 }}>
                  ({currentValues.length}{' '}
                  {currentValues.length === 1 ? 'Record' : 'Records'})
                </span>
              </Text>
              {currentValues.length > 0 ? (
                <TruncatedTagList
                  items={currentValues.map((value) => {
                    const option = options.find((opt) => opt.value === value);
                    return {
                      value,
                      label: option ? option.label : value,
                    };
                  })}
                  onViewAll={() => setIsDrawerOpen(true)}
                />
              ) : (
                <Text>No options selected</Text>
              )}
            </Flex>
          </DzBox>
          <Flex
            justify='space-between'
            align='center'
            gap='0.6rem'
            style={{ alignSelf: 'flex-start' }}>
            {copiedCount !== null && (
              <Text style={{ fontSize: '0.75rem', color: '#34C759' }}>
                {copiedCount} records copied!
              </Text>
            )}
            <CustomTooltip title='Copy Records'>
              <DzBox
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '5px',
                  padding: '0.25rem 0.5rem',
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                }}
                onClick={handleCopy}>
                <CopyPasteIcon />
              </DzBox>
            </CustomTooltip>
            {isEditing && (
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
            <HasPermission
              permissions={[LineItemActionsEnum.ViewValidationSettings]}>
              <CustomTooltip title='View'>
                <DzBox
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                    padding: '0.25rem 0.5rem',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                  }}
                  onClick={() => setIsDrawerOpen(true)}>
                  <EyeOutlined />
                </DzBox>
              </CustomTooltip>
            </HasPermission>
          </Flex>
        </Flex>
      </DzBox>
      <DrawerShowList
        label={label}
        show={isDrawerOpen}
        list={currentValues.map((value) => {
          const option = options.find((opt) => opt.value === value);
          return option ? option.label : value;
        })}
        hasChildren={false}
        handleClose={() => setIsDrawerOpen(false)}
      />
      <ValidationEditDrawer
        isOpen={isEditDrawerOpen}
        onClose={handleClose}
        onSave={handleSave}
        isLoading={isLoading}
        title={label}
        editConfig={editConfig}
        editedData={editedData}
        setEditedData={setEditedData}
      />
    </>
  );
};
