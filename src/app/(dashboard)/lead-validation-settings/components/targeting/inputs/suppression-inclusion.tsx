import { DzBox } from '@/components/layout/v1';
import { DzRecord } from '@/lib/types';
import { RadioChangeEvent } from '@/lib/types/uicomponents';
import { Radio, RadioGroup } from '@/uicomponents/form/input';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { useEffect, useMemo, useState } from 'react';
import { useValidationSettingStore } from '../../../store';
import { TargetingFile } from './targeting-file';
import { fileSortAndUpload } from '../../../lib/utils';
import { useFileUploadMetadataQuery } from '@/app/(dashboard)/campaign-management/line-items/hooks';

type SuppressionInclusionProps = {
  attribute: Record<string, any>;
  sectionName: string;
};

export const SuppressionInclusion = ({
  sectionName,
  attribute,
}: SuppressionInclusionProps) => {
  const [type, setType] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<DzRecord[]>([]);

  const { selectedValues, setSelectedValues, settingMetadata, isReadOnly } =
    useValidationSettingStore();

  const { data: inclusionMetaResponse } = useFileUploadMetadataQuery(
    attribute.fileMetadataType?.inclusion ?? '',
  );
  const { data: exclusionMetaResponse } = useFileUploadMetadataQuery(
    attribute.fileMetadataType?.exclusion ?? '',
  );

  const fileMetadata = useMemo(() => {
    const result: Record<string, any> = {};
    if (inclusionMetaResponse?.data) result.INCLUSION = inclusionMetaResponse.data;
    if (exclusionMetaResponse?.data) result.EXCLUSION = exclusionMetaResponse.data;
    return Object.keys(result).length > 0 ? result : null;
  }, [inclusionMetaResponse, exclusionMetaResponse]);

  useEffect(() => {
    if (
      selectedValues?.[sectionName]?.[attribute.name]?.type &&
      ['INCLUSION', 'EXCLUSION'].includes(
        selectedValues?.[sectionName]?.[attribute.name]?.type,
      )
    ) {
      setType(selectedValues[sectionName][attribute.name].type);
    } else {
      setType(null);
    }

    if (selectedValues?.[sectionName]?.[attribute.name]?.data) {
      setUploadedFiles(selectedValues[sectionName][attribute.name].data);
    } else {
      setUploadedFiles([]);
    }
  }, [selectedValues]);

  const handleTypeChange = (e: RadioChangeEvent) => {
    const sectionSelection = selectedValues?.[sectionName];

    setSelectedValues(sectionName, {
      ...sectionSelection,
      [attribute.name]: {
        type: e.target.value,
        data: null,
      },
    });
  };

  const handleRemoveFile = (file: DzRecord) => {
    const sectionSelection = selectedValues?.[sectionName];

    const attributeSelectionValues =
      sectionSelection?.[attribute.name]?.data?.filter(
        (fileObj: DzRecord) => fileObj.id !== file.id,
      ) || [];

    setSelectedValues(sectionName, {
      ...sectionSelection,
      [attribute.name]: {
        type: sectionSelection?.[attribute.name]?.type,
        data: attributeSelectionValues.length ? attributeSelectionValues : null,
      },
    });
  };

  const handleFileChange = async (
    fileObject: DzRecord,
    type: 'INCLUSION' | 'EXCLUSION',
  ) => {
    setIsLoading(true);
    setIsDisabled(true);
    try {
      const fileTypeName =
        type === 'INCLUSION'
          ? attribute.fileMetadataType?.inclusion
          : attribute.fileMetadataType?.exclusion;
      const uploadedFiles = await fileSortAndUpload(
        fileObject,
        fileMetadata?.[type] as DzRecord,
        settingMetadata?.tenantCode,
        fileTypeName,
      );

      const sectionSelection = selectedValues?.[sectionName];

      const attributeSelectionValues =
        sectionSelection?.[attribute.name]?.data || [];

      setSelectedValues(sectionName, {
        ...sectionSelection,
        [attribute.name]: {
          type: type,
          data: [...attributeSelectionValues, ...uploadedFiles],
        },
      });
    } catch (error) {}

    setIsLoading(false);
    setIsDisabled(false);
    return true;
  };

  return (
    <Flex style={{ width: '100%' }}>
      <RadioGroup
        className='suppression-inclusion-list'
        value={type}
        onChange={handleTypeChange}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
        <DzBox
          style={{
            padding: '1rem 1.25rem',
            border: '1px solid #E5EBF1',
            borderRadius: '0.25rem',
          }}>
          <Radio value='EXCLUSION' disabled={isReadOnly}>
            <RadioContent
              label='Suppression List'
              description='Values in this list will not be accepted during Validation.'
              acceptedFileTypes={fileMetadata?.EXCLUSION?.types || []}
              handleOnFileChange={handleFileChange}
              uploadedFiles={type === 'EXCLUSION' ? uploadedFiles : null}
              handleRemoveFile={handleRemoveFile}
              isDisabled={isDisabled || type !== 'EXCLUSION'}
              isLoading={isLoading}
              type='EXCLUSION'
            />
          </Radio>
        </DzBox>
        <DzBox
          style={{
            padding: '1rem 1.25rem',
            border: '1px solid #E5EBF1',
            borderRadius: '0.25rem',
          }}>
          <Radio value='INCLUSION' disabled={isReadOnly}>
            <RadioContent
              label='Inclusion List'
              description='Only Values in this list will be accepted during Validation.'
              acceptedFileTypes={fileMetadata?.INCLUSION?.types || []}
              handleOnFileChange={handleFileChange}
              uploadedFiles={type === 'INCLUSION' ? uploadedFiles : null}
              handleRemoveFile={handleRemoveFile}
              isDisabled={isDisabled || type !== 'INCLUSION'}
              isLoading={isLoading}
              type='INCLUSION'
            />
          </Radio>
        </DzBox>
      </RadioGroup>
    </Flex>
  );
};

// define RadioContentProps

type RadioContentProps = {
  type: 'INCLUSION' | 'EXCLUSION';
  label: string;
  description: string;
  uploadedFiles: DzRecord[] | null;
  handleRemoveFile: (file: DzRecord) => void;
  handleOnFileChange: (
    fileObject: DzRecord,
    type: 'INCLUSION' | 'EXCLUSION',
  ) => Promise<boolean>;
  isDisabled: boolean;
  acceptedFileTypes: string[];
  isLoading: boolean;
};

export const RadioContent = ({
  type,
  label,
  description,
  uploadedFiles,
  handleRemoveFile,
  handleOnFileChange,
  isDisabled,
  acceptedFileTypes,
  isLoading,
}: RadioContentProps) => {
  const handleFileChange = async (fileObject: DzRecord) => {
    return await handleOnFileChange(fileObject, type);
  };
  return (
    <Flex
      vertical
      gap={'0.75rem'}
      style={{ flex: 1 }}
      className='radio-content'>
      <Text strong>{label}</Text>
      <Text>{description}</Text>
      <Flex
        align='center'
        gap='0.5rem'
        style={{ marginTop: '0.25rem', width: '100%' }}>
        <DzBox style={{ width: '100%' }}>
          <TargetingFile
            acceptedFileTypes={acceptedFileTypes}
            value={uploadedFiles as DzRecord[]}
            handleRemoveFile={handleRemoveFile}
            onFileChange={handleFileChange}
            isDisabled={isDisabled}
            isLoading={isLoading}
          />
        </DzBox>
      </Flex>
    </Flex>
  );
};
