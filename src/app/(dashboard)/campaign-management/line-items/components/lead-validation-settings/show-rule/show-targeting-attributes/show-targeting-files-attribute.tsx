import { DzBox } from '@/components/layout/v1';
import { DzRecord } from '@/lib/types';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { EyeOutlined, FileOutlined, DownloadOutlined } from '@ant-design/icons';
import { DownloadIcon } from '@/uicomponents/icons/svgs';
import React, { useState, useEffect } from 'react';
import { TargetingAttributeValuesDrawer } from './targeting-attribute-values-drawer';
import { MapFunction } from '@/components/shared';
import { fileDownload } from '@/services/file-download';
import { EditICon } from '@/uicomponents/icons/svgs';
import { ValidationEditDrawer } from '../../../edit-drawer/validation-edit-drawer';
import { showNotification } from '@/services/notification';
import { updateLineItemsLeadValidationSettingAttribute } from '../../../../../../lead-validation-settings/services';
import { useValidationSettingStore } from '../../../../../../lead-validation-settings/store';
import { CustomTooltip } from './custom-tooltip';
import { HasPermission } from '@/components/auth';
import { LineItemActionsEnum } from '@/lib/enums/permissions';

type ShowTargetingFileAttributeProps = {
  type: 'INCLUSION' | 'EXCLUSION';
  files: DzRecord[];
  label: string;
  attributeId: string; // Add attribute ID prop
  onUpdate?: (newFiles: DzRecord[]) => void; // Callback to update parent state
  isEditing?: boolean;
  isFirst?: boolean;
};

const DrawerItemStyle = {
  padding: '0.5rem',
  borderRadius: '5px',
  border: '1px solid #D3E3EE',
};

export const ShowTargetingFileAttribute = ({
  type,
  files,
  label,
  attributeId,
  onUpdate,
  isEditing = false,
  isFirst = false,
}: ShowTargetingFileAttributeProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<any[]>([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState(false);
  const [currentFiles, setCurrentFiles] = useState<DzRecord[]>(files);

  const enabledFiles = currentFiles.filter((file) => !file.isDisabled);

  useEffect(() => {
    setCurrentFiles(files);
  }, [files]);

  const handleDownloadFile = async (fileId: string) => {
    try {
      await fileDownload(fileId);
    } catch (error) {}
  };

  const handleDownloadAllFiles = async () => {
    if (!enabledFiles?.length) return;

    for (const f of enabledFiles) {
      try {
        await handleDownloadFile(f.id);
        // Add a small delay between downloads to prevent browser blocking
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {}
    }

    showNotification({
      message: `Downloaded ${enabledFiles.length} file(s)`,
      type: 'success',
    });
  };
  const handleEdit = () => {
    // Initialize editedData with current files when opening the drawer
    // Ensure isDisabled reflects the current state (false means checked/enabled)
    const initialFiles = currentFiles.map((file) => ({
      ...file,
      isDisabled: file.isDisabled === true, // Preserve existing isDisabled state
    }));
    setEditedData(initialFiles);
    setIsEditDrawerOpen(true);
  };

  const handleClose = () => {
    setIsEditDrawerOpen(false);
    setEditedData([]); // Set to empty array instead of empty object
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
      // Use editedData if available (after editing), otherwise use currentFiles
      const filesToSave =
        Array.isArray(editedData) && editedData.length >= 0 // Changed from > 0 to >= 0 to handle empty array after all files deleted
          ? editedData
          : currentFiles;

      // Map all files with their proper isDisabled state
      // Note: In the UI, isDisabled=false means the file is checked/enabled
      // isDisabled=true means the file is unchecked/disabled
      const requestData = {
        attribute: {
          name: label.toLowerCase(),
          type,
          value: filesToSave.map((f: any) => ({
            id: f.id,
            isDisabled: f.isDisabled === true, // Ensure boolean value
          })),
        },
      };

      await updateLineItemsLeadValidationSettingAttribute(
        leadValidationSettingInfo.lineItemId,
        leadValidationSettingInfo.leadValidationSettingId,
        attributeId, // Use the attribute ID instead of label
        requestData,
      );

      showNotification({
        message: 'File list saved successfully!',
        type: 'success',
      });

      // Refresh the validation settings data from the backend
      const { fetchConfiguration } = useValidationSettingStore.getState();
      await fetchConfiguration();

      // Note: We don't update local state for files since the refresh will provide the latest data

      // Call parent callback if provided
      if (onUpdate) {
        onUpdate(filesToSave);
      }

      setIsEditDrawerOpen(false);
    } catch (error) {
      showNotification({ message: 'Failed to save file list.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFileDetails = (file: DzRecord) => {
    return (
      <DzBox style={DrawerItemStyle} key={file.id}>
        <Flex
          justify='space-between'
          align='center'
          style={{ marginTop: '0.25rem' }}>
          <Text>{file.name}</Text>
          <DzBox
            style={{
              backgroundColor: '#fff',
              borderRadius: '5px',
              padding: '0.25rem 0.5rem',
              border: '1px solid #ddd',
              cursor: 'pointer',
            }}>
            <DownloadOutlined onClick={() => handleDownloadFile(file.id)} />
          </DzBox>
        </Flex>
      </DzBox>
    );
  };

  return (
    <>
      <DzBox>
        <Flex vertical>
          <DzBox style={{ paddingTop: isFirst ? '0.75rem' : 0 }}>
            <Text
              strong
              style={{ fontSize: '0.875rem', marginLeft: '0.75rem' }}>
              {label}
            </Text>
          </DzBox>
          <Flex
            justify='space-between'
            align='center'
            style={{
              backgroundColor: '#F9FAFB',
              borderRadius: '10px',
              padding: '0.5rem',
              margin: '0rem 0.75rem',
            }}>
            <DzBox>
              <Flex gap='0.5rem' align='center'>
                <DzBox
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                    padding: '0.25rem 0.5rem',
                    border: '1px solid #235AED29',
                  }}>
                  <FileOutlined style={{ color: '#3D71FB' }} />
                </DzBox>
                <Text style={{ color: '#707070', fontSize: '0.875rem' }} strong>
                  {type === 'INCLUSION' ? 'Inclusion List' : 'Suppression List'}
                  {enabledFiles.length > 0 && (
                    <span style={{ fontWeight: 400, marginLeft: '0.5rem' }}>
                      (
                      {`${enabledFiles.length} File${enabledFiles.length > 1 ? 's' : ''}`}
                      )
                    </span>
                  )}
                </Text>
              </Flex>
            </DzBox>
            <Flex justify='space-between' align='center' gap='0.6rem'>
              <CustomTooltip title='Download Files'>
                <DzBox
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                    padding: '0.25rem 0.5rem',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                  }}
                  onClick={handleDownloadAllFiles}>
                  <DownloadIcon />
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
        </Flex>
      </DzBox>
      <TargetingAttributeValuesDrawer
        header={`${label} (${type === 'INCLUSION' ? 'Inclusion List' : 'Suppression List'})`}
        isOpen={isDrawerOpen}
        handleClose={() => setIsDrawerOpen(false)}>
        <Flex vertical gap='0.5rem'>
          <MapFunction items={enabledFiles} renderItem={renderFileDetails} />
        </Flex>
      </TargetingAttributeValuesDrawer>
      <ValidationEditDrawer
        isOpen={isEditDrawerOpen}
        onClose={handleClose}
        title={`${label} (${type === 'INCLUSION' ? 'Inclusion List' : 'Suppression List'})`}
        onSave={handleSave}
        isLoading={isLoading}
        editConfig={{
          type: 'files',
          fileMetaTypeName: currentFiles?.[0]?.type,
          props: {
            allowUpload: true,
            allowDelete: true,
            acceptedFileTypes: ['.csv', '.xlsx', '.txt'],
          },
        }}
        editedData={editedData}
        setEditedData={setEditedData}
      />
    </>
  );
};
