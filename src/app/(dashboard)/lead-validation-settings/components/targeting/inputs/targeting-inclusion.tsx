import { DzBox } from '@/components/layout/v1';
import { DzRecord } from '@/lib/types';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { useEffect, useState } from 'react';
import { fileSortAndUpload } from '../../../lib/utils';
import { useValidationSettingStore } from '../../../store';
import { TargetingFile } from './targeting-file';
import { useFileUploadMetadataQuery } from '@/app/(dashboard)/campaign-management/line-items/hooks';

type InclusionProps = {
  attribute: Record<string, any>;
  sectionName: string;
};

export const TargetingInclusion = ({ attribute, sectionName }: InclusionProps) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<DzRecord[]>([]);

  const { data: metadataResponse } = useFileUploadMetadataQuery(
    attribute.fileMetadataType?.inclusion ?? '',
  );
  const inclusionFileMetadata = metadataResponse?.data ?? null;

  const { selectedValues, setSelectedValues, settingMetadata } = useValidationSettingStore();

  useEffect(() => {
    if (selectedValues?.[sectionName]?.[attribute.name]?.data) {
      setUploadedFiles(selectedValues[sectionName][attribute.name].data);
    } else {
      setUploadedFiles([]);
    }
  }, [selectedValues]);

  const handleRemoveFile = (file: DzRecord) => {
    const sectionSelection = selectedValues?.[sectionName];

    const attributeSelectionValues =
      sectionSelection?.[attribute.name]?.data?.filter(
        (fileObj: DzRecord) => fileObj.id !== file.id,
      ) || [];

    setSelectedValues(sectionName, {
      ...sectionSelection,
      [attribute.name]: attributeSelectionValues.length
        ? {
            type: 'INCLUSION',
            data: attributeSelectionValues,
          }
        : null,
    });
  };

  const handleFileChange = async (fileObject: DzRecord) => {
    setIsLoading(true);
    setIsDisabled(true);
    try {
      const uploadedFiles = await fileSortAndUpload(
        fileObject,
        inclusionFileMetadata as DzRecord,
        settingMetadata?.tenantCode,
        attribute.fileMetadataType?.inclusion,
      );

      const sectionSelection = selectedValues?.[sectionName];

      const attributeSelectionValues = sectionSelection?.[attribute.name]?.data || [];

      setSelectedValues(sectionName, {
        ...sectionSelection,
        [attribute.name]: {
          type: 'INCLUSION',
          data: [...attributeSelectionValues, ...uploadedFiles],
        },
      });
    } catch (error) {}

    setIsLoading(false);
    setIsDisabled(false);
    return true;
  };

  return (
    <DzBox
      style={{
        padding: '1rem 1.25rem',
      }}
    >
      <Flex vertical gap={'0.75rem'}>
        <DzBox>
          <Text strong>{attribute.label}</Text>
        </DzBox>
        <DzBox>
          <TargetingFile
            acceptedFileTypes={inclusionFileMetadata?.types || []}
            value={uploadedFiles}
            handleRemoveFile={handleRemoveFile}
            onFileChange={handleFileChange}
            isDisabled={isDisabled}
            isLoading={isLoading}
          />
        </DzBox>
      </Flex>
    </DzBox>
  );
};
