import { Translate } from '@/components/i18n';
import { showNotification } from '@/services/notification';
import { Button } from '@/uicomponents';
import { LoadingOutlined } from '@/uicomponents/icons';
import { Space } from '@/uicomponents/layout';
import { useRouter } from '@/lib/hooks/use-router';
import { FC, useEffect, useState } from 'react';
import { createTemplate, updateTemplateDetails } from '../../../../services';
import { useTemplateStore } from '../../../../stores';
import { SaveTemplateDilog } from '../../field-toolbar-actions/save-template-modal';

export const Step2Actions: FC = () => {
  const router = useRouter();
  const {
    visibleFieldsCount,
    isSaveDisabled,
    getUpdatedTemplateDetails,
    existingTemplate,
    updatedTemplateData,
    setInitialTemplateData,
    formatRequestData,
    resetStore,
  } = useTemplateStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [isUpdateActivity, setIsUpdateActivity] = useState<boolean | null>(null);

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

  const handleCancel = () => {
    resetStore();
    router.push('/integrations-hub/templates');
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

  const getDataForSaving = (isUpdating = false) => {
    const updatedTemplate = getUpdatedTemplateDetails();
    return formatRequestData(updatedTemplate, isUpdating);
  };

  const saveTemplate = async (isUpdating = false) => {
    try {
      const updatedTemplate = getDataForSaving(isUpdating);
      if (!updatedTemplate) {
        return;
      }
      setIsLoading(true);
      const data = isUpdating
        ? await updateTemplateDetails(updatedTemplate.id as string, updatedTemplate)
        : await createTemplate(updatedTemplate);
      if (data) {
        setInitialTemplateData(data.data, true);
        setIsUpdateActivity(null);
        showNotification({
          type: 'success',
          message: data.message,
        });
        router.push('/integrations-hub/templates');
      }
    } catch (error) {
      showNotification({
        type: 'error',
        message: 'Error saving template',
      });
    }
    setIsLoading(false);
  };

  const updateTemplate = async () => {
    saveTemplate(true);
  };

  return (
    <>
      <Space size='middle'>
        <Button size='small' onClick={handleCancel}>
          <Translate i18nKey='pages.templates.label.cancel' />
        </Button>
        <Button
          type='primary'
          size='small'
          style={{ width: '8rem', textAlign: 'center' }}
          disabled={visibleFieldsCount === 0 || isSaveDisabled || isLoading}
          onClick={handleSaveTemplate}
        >
          {isLoading ? (
            <LoadingOutlined />
          ) : existingTemplate ? (
            <Translate i18nKey='pages.templates.label.update' />
          ) : (
            <Translate i18nKey='pages.templates.label.create' />
          )}
        </Button>
      </Space>
      <SaveTemplateDilog
        openModal={showModal}
        handleCancel={closeModal}
        handleActivity={handleActivity}
      />
    </>
  );
};
