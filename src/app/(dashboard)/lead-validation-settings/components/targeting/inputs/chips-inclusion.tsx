import { JobTitle } from '@/components/job-title';
import { DzBox } from '@/components/layout/v1';
import { DzRecord } from '@/lib/types';
import { Text } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { useEffect, useState } from 'react';
import { fileSortAndUpload } from '../../../lib/utils';
import { useValidationSettingStore } from '../../../store';
import { TargetingFile } from './targeting-file';
import { useFileUploadMetadataQuery } from '@/app/(dashboard)/campaign-management/line-items/hooks';

type ChipsInclusionProps = {
  attribute: Record<string, any>;
  sectionName: string;
};

export const ChipsInclusion = ({
  attribute,
  sectionName,
}: ChipsInclusionProps) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<DzRecord[]>([]);
  const [options, setOptions] = useState<DzRecord[]>([]);
  const [inputMethod, setInputMethod] = useState('manual');

  const { selectedValues, setSelectedValues, settingMetadata, isReadOnly } =
    useValidationSettingStore();

  const { data: metadataResponse } = useFileUploadMetadataQuery(
    attribute.fileMetadataType?.inclusion ?? '',
  );
  const inclusionFileMetadata = metadataResponse?.data ?? null;

  useEffect(() => {
    const type = selectedValues?.[sectionName]?.[attribute.name]?.type;
    if (type) {
      if (type === 'OPTIONS') {
        setOptions(selectedValues[sectionName][attribute.name].data);
        setUploadedFiles([]);
        setInputMethod('manual');
      } else {
        setOptions([]);
        setUploadedFiles(selectedValues[sectionName][attribute.name].data);
        setInputMethod('upload');
      }
    } else {
      setOptions([]);
      setUploadedFiles([]);
    }
  }, [selectedValues]);

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

      const attributeSelectionValues =
        sectionSelection?.[attribute.name]?.data || [];

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

  const handleAddOption = (values: DzRecord[]) => {
    const sectionSelection = selectedValues?.[sectionName];

    setSelectedValues(sectionName, {
      ...sectionSelection,
      [attribute.name]: {
        type: 'OPTIONS',
        data: values,
      },
    });
  };

  const handleRemoveOption = (value: string) => {
    const sectionSelection = selectedValues?.[sectionName];
    const attributeSelectionValues =
      sectionSelection?.[attribute.name]?.data?.filter(
        (val: string) => val !== value,
      ) || [];

    setSelectedValues(sectionName, {
      ...sectionSelection,
      [attribute.name]: attributeSelectionValues.length
        ? {
            type: 'OPTIONS',
            data: attributeSelectionValues,
          }
        : null,
    });
  };

  const jobTitleOnChange = (jtList: Record<string, any>[]) => {
    handleAddOption(jtList);
  };

  return (
    <DzBox
      className='chips-inclusion-container'
      style={{
        borderRadius: '5px',
      }}>
      <Flex vertical gap={'1rem'} style={{ width: '100%' }}>
        <Flex
          style={{
            border: '1px solid #B9B7B75C',
            borderRadius: '0.4rem',
            padding: '1rem 1.25rem',
            width: '100%',
            alignItems: 'flex-start',
          }}>
          <Radio
            value='manual'
            checked={inputMethod === 'manual'}
            onChange={(e: RadioChangeEvent) => {
              setInputMethod(e.target.value);
              setSelectedValues(sectionName, {
                ...selectedValues?.[sectionName],
                [attribute.name]: null,
              });
            }}
          />
          <div
            style={{
              width: '100%',
              pointerEvents: inputMethod !== 'manual' ? 'none' : 'auto',
              opacity: inputMethod !== 'manual' ? 0.5 : 1,
            }}>
            <DzBox
              style={{
                width: '100%',
                alignSelf: 'flex-start',
                pointerEvents: isReadOnly ? 'none' : 'auto',
              }}>
              <JobTitle
                value={options}
                containerClassName='chips-input-textbox'
                onChange={jobTitleOnChange}
                customProps={{
                  type: 'chips',
                  placeholder: 'Add Job Titles',
                  disabled: inputMethod !== 'manual',
                }}
              />
            </DzBox>
          </div>
        </Flex>

        <Flex
          align='flex-start'
          gap={'1rem'}
          style={{
            border: '1px solid #B9B7B75C',
            borderRadius: '0.4rem',
            padding: '1rem 1.25rem',
            width: '100%',
          }}>
          <Radio
            value='upload'
            checked={inputMethod === 'upload'}
            onChange={(e: RadioChangeEvent) => {
              setInputMethod(e.target.value);
              setSelectedValues(sectionName, {
                ...selectedValues?.[sectionName],
                [attribute.name]: null,
              });
            }}
          />
          <div
            style={{
              width: '100%',
              pointerEvents: inputMethod !== 'upload' ? 'none' : 'auto',
              opacity: inputMethod !== 'upload' ? 0.5 : 1,
            }}>
            <DzBox style={{ width: '100%' }}>
              <TargetingFile
                acceptedFileTypes={inclusionFileMetadata?.types || []}
                value={uploadedFiles as DzRecord[]}
                handleRemoveFile={handleRemoveFile}
                onFileChange={handleFileChange}
                isDisabled={isDisabled}
                isLoading={isLoading}
              />
            </DzBox>
          </div>
        </Flex>
      </Flex>
    </DzBox>
  );
};
