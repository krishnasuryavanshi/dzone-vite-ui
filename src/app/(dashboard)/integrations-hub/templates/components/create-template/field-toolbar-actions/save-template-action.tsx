import { Translate } from '@/components/i18n';
import { showNotification } from '@/services/notification';
import { Button } from '@/uicomponents';
import { LoadingOutlined } from '@/uicomponents/icons';
import { FC, useEffect, useState } from 'react';
import { ITemplateFieldResponse } from '../../../lib/types';
import { createTemplate, updateTemplateDetails } from '../../../services';
import { useTemplateStore } from '../../../stores';
import { SaveTemplateDilog } from './save-template-modal';

interface ISaveTemplateProps {
  handleAfterSuccessfulSave?: () => void;
  getCurrentFieldData?: () => Promise<{
    field: ITemplateFieldResponse;
    index: number;
  }>;
}

export const SaveTemplateAction: FC<ISaveTemplateProps> = ({
  handleAfterSuccessfulSave,
  getCurrentFieldData,
}) => {
  const {
    visibleFieldsCount,
    isSaveDisabled,
    getUpdatedTemplateDetails,
    existingTemplate,
    updatedTemplateData,
    setInitialTemplateData,
    formatRequestData,
  } = useTemplateStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showModal, setShowModal] = useState(false);
  const [isUpdateActivity, setIsUpdateActivity] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    if (isUpdateActivity === false) {
      saveTemplate();
    } else if (isUpdateActivity === true) {
      updateTemplate();
    }
    if (isUpdateActivity !== null) {
      setIsUpdateActivity(null);
    }
  }, [isUpdateActivity]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleActivity = (updating: boolean) => {
    setIsUpdateActivity(updating);
    closeModal();
  };

  const handleSaveTemplate = () => {
    if (existingTemplate) {
      if (updatedTemplateData?.count?.lineItems) {
        setIsUpdateActivity(null);
        openModal();
      } else {
        setIsUpdateActivity(true);
        closeModal();
      }
    } else {
      setIsUpdateActivity(false);
      closeModal();
    }
  };

  const getDataForSaving = async (isUpdating = false) => {
    try {
      const updatedTemplate = getUpdatedTemplateDetails();
      if (getCurrentFieldData) {
        const fieldData = await getCurrentFieldData();
        if (fieldData?.field && fieldData?.index !== -1) {
          updatedTemplate.fields[fieldData.index] = fieldData.field;
        } else {
          showNotification({
            type: 'error',
            message: 'Error while getting template data',
          });
          return;
        }
      }
      return formatRequestData(updatedTemplate, isUpdating);
    } catch (error) {
      showNotification({
        type: 'error',
        message: 'Error while getting template data',
      });
    }
  };

  const saveTemplate = async (isUpdating = false) => {
    try {
      const updatedTemplate = await getDataForSaving(isUpdating);
      if (!updatedTemplate) {
        return;
      }
      setIsLoading(true);
      const data = isUpdating
        ? await updateTemplateDetails(
            updatedTemplate.id as string,
            updatedTemplate,
          )
        : await createTemplate(updatedTemplate);
      if (data) {
        setInitialTemplateData(data.data, true);
        setIsUpdateActivity(null);
        handleAfterSuccessfulSave?.();
        showNotification({
          type: 'success',
          message: data.message,
        });
      }
    } catch (error) {}
    setIsLoading(false);
  };

  const updateTemplate = async () => {
    saveTemplate(true);
  };

  return (
    <>
      <Button
        type='primary'
        size='small'
        style={{ width: '8rem', textAlign: 'center', boxShadow: 'none' }}
        disabled={visibleFieldsCount === 0 || isSaveDisabled || isLoading}
        onClick={handleSaveTemplate}>
        {isLoading ? (
          <LoadingOutlined />
        ) : existingTemplate ? (
          <Translate i18nKey='pages.templates.label.update' />
        ) : (
          <Translate i18nKey='pages.templates.label.create' />
        )}
      </Button>
      <SaveTemplateDilog
        openModal={showModal}
        handleCancel={closeModal}
        handleActivity={handleActivity}
      />
    </>
  );
};

// HOC for Save Button
const withDrawerCloseHandler = (
  SaveTemplateActionButton: FC<ISaveTemplateProps>,
) => {
  return function DrawerSaveTemplateAction({
    closeFieldDrawer,
    getCurrentFieldData,
  }: {
    closeFieldDrawer: () => void;
    getCurrentFieldData: () => Promise<{
      field: ITemplateFieldResponse;
      index: number;
    }>;
  }) {
    const handleAfterSuccessfulSave = () => {
      closeFieldDrawer();
    };

    return (
      <SaveTemplateActionButton
        handleAfterSuccessfulSave={handleAfterSuccessfulSave}
        getCurrentFieldData={getCurrentFieldData}
      />
    );
  };
};

// HOC usage for drawer
export const DrawerSaveTemplateButton =
  withDrawerCloseHandler(SaveTemplateAction);
