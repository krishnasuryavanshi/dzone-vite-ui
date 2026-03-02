import React, { ReactNode, useEffect, useState } from 'react';
import { Button } from '@/uicomponents/button';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { DzBox } from '@/components/layout/v1';
import { FileManager } from './file-manager';
import { Drawer } from '@/uicomponents/drawers';
import styles from './validation-edit-drawer.module.css';
import type { FileItemType } from './file-manager';
import { ValidationSettingRuleSection } from '@/app/(dashboard)/lead-validation-settings/components/validations/validation-setting-rule-section';
import { ChipsEdit } from './chips-edit';
import { ListSelectionEdit } from './list-selection-edit';
import { MapFunction } from '@/components/shared';
import { useValidationSettingStore } from '@/app/(dashboard)/lead-validation-settings/store';

export interface EditConfig {
  type?: string; // Can be any custom type
  options?: any; // Custom options
  fields?: any[]; // Custom fields
  props?: any; // Additional props
  fileMetaTypeName?: string | null; // For 'files' type, specify the file metadata type name
}

interface ValidationEditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSave: () => void;
  isLoading?: boolean;
  ruleName?: string; // Required validation type
  editConfig?: EditConfig; // Optional additional configuration
  editedData: any;
  setEditedData: (data: any) => void;
  children?: ReactNode;
}

export const ValidationEditDrawer: React.FC<ValidationEditDrawerProps> = ({
  isOpen,
  onClose,
  title,
  onSave,
  isLoading = false,
  ruleName,
  editConfig = {},
  editedData,
  setEditedData,
  children,
}) => {
  const { getValidationSettingRuleSections, activeRule } =
    useValidationSettingStore();
  const [ruleSections, setRuleSections] = useState<Record<string, any>[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSearchTerm(''); // Clear search term when drawer opens
    }
  }, [isOpen]);

  useEffect(() => {
    if (activeRule) {
      const sections = getValidationSettingRuleSections();
      setRuleSections(sections);
    } else {
      setRuleSections([]);
    }
  }, [activeRule, getValidationSettingRuleSections]);

  const handleSelectionChange = (
    fileData: Array<{ id: string; isDisabled: boolean }>,
  ) => {
    const updatedFiles = (editedData.files || []).map((file: FileItemType) => {
      const selectedItem = fileData.find((item) => item.id === file.id);
      if (selectedItem) {
        return { ...file, isDisabled: selectedItem.isDisabled };
      }
      return file;
    });

    setEditedData({ ...editedData, files: updatedFiles });
  };

  const renderEditor = () => {
    const validationTypeFromConfig = editConfig.type;
    const ruleKey = ruleName ? ruleName : validationTypeFromConfig;

    let fileMetaType: string | null = null;
    if (ruleKey === 'files') {
      for (const section of getValidationSettingRuleSections()) {
        const attribute = section.attributes?.find(
          (attr: any) => attr.name === editConfig.props?.attributeName,
        );
        if (attribute?.fileMetadataType) {
          fileMetaType =
            attribute.fileMetadataType.inclusion ||
            attribute.fileMetadataType.exclusion ||
            attribute.fileMetadataType;
          break;
        }
      }
      // Fallback to editConfig if fileMetaType is still not found
      if (!fileMetaType && editConfig.props?.fileMetadataTypeName) {
        fileMetaType = editConfig.props.fileMetadataTypeName;
      }
    }
    switch (ruleKey) {
      case 'files':
        return (
          <FileManager
            inline={true}
            isOpen={true}
            onClose={onClose}
            title={title}
            files={editedData || []}
            onFilesChange={(files) => setEditedData(files)}
            onSave={onSave}
            allowUpload={editConfig.props?.allowUpload ?? true}
            allowDelete={editConfig.props?.allowDelete ?? true}
            acceptedFileTypes={
              editConfig.props?.acceptedFileTypes || ['.csv', '.xlsx', '.txt']
            }
            onSelectionChange={handleSelectionChange}
            fileMetadataTypeName={editConfig.fileMetaTypeName}
            {...(editConfig.props || {})}
          />
        );

      case 'chips':
        return (
          <ChipsEdit
            values={editedData.selectedValues || []}
            onChange={(chips) =>
              setEditedData({ ...editedData, selectedValues: chips })
            }
            label={title}
            placeholder={editConfig.props?.placeholder || 'Add New'}
          />
        );
      case 'list-selection':
        return (
          <ListSelectionEdit
            values={editedData.selectedValues || []}
            onChange={(newValues) =>
              setEditedData({ ...editedData, selectedValues: newValues })
            }
            predefinedOptions={editConfig.props?.predefinedOptions || []}
            showSearch={editConfig.props?.showSearch}
            allowCustomRange={editConfig.props?.allowCustomRange}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />
        );
      case 'custom':
        return (
          children || (
            <DzBox style={{ padding: '1rem', textAlign: 'center' }}>
              <Text>Custom edit component needed</Text>
            </DzBox>
          )
        );

      default:
        if (!ruleKey) return null;
        return (
          <MapFunction
            items={ruleSections}
            renderItem={(section: Record<string, any>, index: number) => (
              <ValidationSettingRuleSection
                name={section.name}
                key={index}
                noBorder={
                  section.name === 'LOOPBACK_PERIOD' || section.noBorder
                }
              />
            )}
          />
        );
    }
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title={title}
      width={500}
      rootClassName={styles.blueHeader}
      styles={{
        body: {
          border: '1px solid #D3E3EE',
          margin: '1.5rem',
          borderRadius: '4px',
          padding: '1rem',
        },
      }}
      footer={
        <Flex
          gap='0.75rem'
          justify='flex-end'
          style={{ padding: '1rem 1.5rem' }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type='primary' onClick={onSave} loading={isLoading}>
            Save
          </Button>
        </Flex>
      }>
      <DzBox>{renderEditor()}</DzBox>
    </Drawer>
  );
};
