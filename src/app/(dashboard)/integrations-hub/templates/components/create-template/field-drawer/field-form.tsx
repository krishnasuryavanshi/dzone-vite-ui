import { IFileUploadMetaData } from '@/app/(dashboard)/campaign-management/line-items/lib/types';
import { Translate } from '@/components/i18n';
import { DzBox } from '@/components/layout/v1';
import { DeliveryTemplateActionsEnum } from '@/lib/enums/permissions';
import { usePermissionCheck } from '@/lib/hooks';
import { Text } from '@/uicomponents';
import { Form, FormInstance, FormItem } from '@/uicomponents/form';
import { InfoCircleOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Col } from '@/uicomponents/layout/grid';
import { Tooltip } from '@/uicomponents/tooltip';
import { FC, useEffect, useMemo, useState } from 'react';
import { DataMapperTemplateTypes } from '../../../lib/constants';
import {
  IDataMapperFileDetails,
  ITemplateFieldDataType,
  ITemplateFieldResponse,
} from '../../../lib/types';
import { validateDestinationName } from '../../../lib/utils';
import { getFieldMappingOptions } from '../../../lib/utils/get-field-mapping-options';
import { useTemplateStore } from '../../../stores';
import { DataDictionaryModal } from '../data-dictionary';
import { UploadTemplates } from '../upload-template';
import './field-form.scss';
import { UploadedFileName } from './uploaded-file-name';

const DESTINATION_FIELD_NAME = 'destination';

interface IFieldFormProps {
  form: FormInstance<any>;
  index: number;
  dataTypePicklist: ITemplateFieldDataType[];
  templateField: ITemplateFieldResponse | null;
  mapperFileUploadMetadata?: IFileUploadMetaData;
}

export const FieldForm: FC<IFieldFormProps> = ({
  form,
  index,
  dataTypePicklist,
  templateField,
  mapperFileUploadMetadata,
}) => {
  const {
    templateId,
    reservedNames,
    destinationFieldNames,
    updateFieldErrorStatus,
    deliveryType,
    masterFieldMappings,
    formFieldMappingOptions,
  } = useTemplateStore();
  const editPermission = usePermissionCheck(DeliveryTemplateActionsEnum.Edit);
  const createPermission = usePermissionCheck(DeliveryTemplateActionsEnum.Create);
  const isEditTemplateAllowed = templateId ? !editPermission : !createPermission;
  const [uploadedFile, setUploadedFile] = useState<IDataMapperFileDetails | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  // Calculate mapping options for HubSpot/WebForm delivery type based on current field's fieldValue
  const mappingOptions = useMemo(() => {
    if (
      (deliveryType === 'HubSpot' || deliveryType === 'WebForm') &&
      formFieldMappingOptions &&
      formFieldMappingOptions.length > 0
    ) {
      return formFieldMappingOptions;
    }
    if (deliveryType === 'HubSpot' && templateField?.fieldValue && masterFieldMappings) {
      return getFieldMappingOptions(templateField.fieldValue, masterFieldMappings);
    }
    return [];
  }, [deliveryType, formFieldMappingOptions, templateField?.fieldValue, masterFieldMappings]);

  useEffect(() => {
    if (templateField) {
      if (templateField.dataMapperFile) {
        setUploadedFile(templateField.dataMapperFile);
      } else {
        setUploadedFile(null);
      }
    }
  }, [templateField, form]);

  const closeDictionaryModal = () => {
    setOpenModal(false);
  };

  const handleFileUpload = (
    fileData: {
      id: string;
      fileName: string;
      fileType: string;
      fileSize: string;
      location: string;
    } | null,
  ) => {
    setUploadedFile(fileData);
    form.setFieldsValue({ dataMapperFile: fileData });
  };

  const removeFile = () => {
    setUploadedFile(null);
    form.setFieldsValue({ dataMapperFile: null });
  };

  const validateDestinationNameSync = (destination: string) => {
    const validationError = validateDestinationName(
      destination,
      reservedNames,
      destinationFieldNames?.filter((name) => name !== templateField?.destination.toLowerCase()),
      DESTINATION_FIELD_NAME,
      updateFieldErrorStatus,
    );
    return validationError;
  };

  return (
    <DzBox className='template-field-form'>
      <Form form={form} layout='vertical' key={index}>
        {/* AC19: Hide the following fields from field properties drawer:
            - DZ One Field Name (Source) - HIDDEN
            - Delivery Field Name (Destination) - HIDDEN
            - Data Type - HIDDEN
            - Data Dictionary - HIDDEN (Link)
            - Minimum Characters - HIDDEN
            - Maximum Characters - HIDDEN
            The drawer will only show Data Mapper File field */}

        {/* Data Mapper File Field */}
        <Col xs={24} sm={16}>
          <FormItem
            className='input-control form-control-item'
            name='dataMapperFile'
            label={
              <Text style={{ fontWeight: '500' }}>
                <Translate i18nKey='pages.templates.label.dataMapper' />
                <Tooltip
                  placement='right'
                  overlayClassName='custom-tooltip'
                  title={<Translate i18nKey='pages.templates.label.dataMapperTooltip' />}
                >
                  <InfoCircleOutlined style={{ marginLeft: '5px' }} />
                </Tooltip>
              </Text>
            }
          >
            <Flex gap='.5rem' align='center'>
              <UploadTemplates
                onFileUpload={handleFileUpload}
                mapperFileUploadMetadata={mapperFileUploadMetadata}
                type={
                  DataMapperTemplateTypes[
                    templateField?.name as keyof typeof DataMapperTemplateTypes
                  ] || ''
                }
                isDisabled={isEditTemplateAllowed}
              />
              <UploadedFileName
                file={uploadedFile}
                removeFile={removeFile}
                isDisabled={isEditTemplateAllowed}
              />
            </Flex>
          </FormItem>
        </Col>
      </Form>

      <DataDictionaryModal
        openModal={openModal}
        closeDictionaryModal={closeDictionaryModal}
        dataDictionaryList={dataTypePicklist}
      />
    </DzBox>
  );
};
