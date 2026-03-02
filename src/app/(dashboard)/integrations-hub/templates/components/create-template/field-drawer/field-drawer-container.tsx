import { showNotification } from '@/services/notification';
import { Modal } from '@/uicomponents';
import { useForm } from '@/uicomponents/form';
import { ExclamationCircleOutlined } from '@/uicomponents/icons';
import { FC, useEffect, useState } from 'react';
import { ITemplateFieldResponse } from '../../../lib/types';
import { useTemplateStore } from '../../../stores';
import { FieldDrawer } from './field-drawer';

interface IFieldDrawerContainerProps {
  index: number;
  isFieldDrawerOpen: boolean;
  closeFieldDrawer: () => void;
}

const NavigationErrorMessages =
  'This field has errors, please fix them before moving to another field';

export const FieldDrawerContainer: FC<IFieldDrawerContainerProps> = ({
  index,
  isFieldDrawerOpen,
  closeFieldDrawer,
}) => {
  const [modal, contextHolder] = Modal.useModal();
  const { updatedTemplateData, getFieldByIndex, updateFieldByIndex } =
    useTemplateStore();
  const [uploadedMapperFile, setUploadedMapperFile] =
    useState<Record<string, any>>();

  const [form] = useForm();
  const [currentField, setCurrentField] =
    useState<ITemplateFieldResponse | null>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(index);

  useEffect(() => {
    const newField = getFieldByIndex(currentIndex);
    setCurrentField(newField);
    setUploadedMapperFile(newField.dataMapperFile);
    form.setFieldsValue(newField);
  }, [currentIndex]);

  const handleNext = async () => {
    try {
      await handleUpdateFormValues();
      const nextIndex = currentIndex + 1;
      if (nextIndex < (updatedTemplateData?.fields?.length ?? 0)) {
        setCurrentIndex(nextIndex);
      }
    } catch (error) {
      showNotification({
        type: 'error',
        message: NavigationErrorMessages,
      });
    }
  };

  const handlePrev = async () => {
    try {
      await handleUpdateFormValues();
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        setCurrentIndex(prevIndex);
      }
    } catch (error) {
      showNotification({
        type: 'error',
        message: NavigationErrorMessages,
      });
    }
  };

  const handleUpdateFormValues = async (syncFields: boolean = false) => {
    try {
      const formValues = await form.validateFields();
      const { characters, dataMapperFile, destination, dataTypeName } =
        formValues;

      const mapperFile =
        typeof dataMapperFile === 'object'
          ? dataMapperFile
          : uploadedMapperFile;

      const updatedField = {
        ...currentField,
        dataTypeName,
        characters,
        dataMapperFile: mapperFile,
        destination,
      } as ITemplateFieldResponse;
      updateFieldByIndex(currentIndex, updatedField, syncFields);
      form.setFieldsValue({});
      return Promise.resolve(updatedField);
    } catch (error) {
      return Promise.reject(new Error('Form validation failed'));
    }
  };

  const handleCloseDrawer = async () => {
    try {
      await handleUpdateFormValues(true);
      closeFieldDrawer();
    } catch (error) {
      const confirmed = await modal.confirm({
        title: 'Confirm',
        icon: <ExclamationCircleOutlined />,
        content:
          'This field has errors, You will loose the changes of current field properties. Do you want to continue?',
        okText: 'Yes',
        cancelText: 'No, keep editing',
      });
      if (confirmed) {
        closeFieldDrawer();
      }
    }
  };

  const getCurrentFieldData = async () => {
    const currentField = await handleUpdateFormValues(true);
    return {
      field: currentField,
      index: currentIndex,
    };
  };

  return (
    <>
      <FieldDrawer
        form={form}
        isFieldDrawerOpen={isFieldDrawerOpen}
        closeFieldDrawer={handleCloseDrawer}
        templateField={currentField}
        currentIndex={currentIndex}
        handleNext={handleNext}
        handlePrev={handlePrev}
        getCurrentFieldData={getCurrentFieldData}
      />
      {contextHolder}
    </>
  );
};
