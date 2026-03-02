import { ExclamationCircleFilled } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';
import { Translate } from '../i18n';
import { Button, Modal, Text } from '../uicomponents';
import { DzRecord } from '@/lib/types/dz-record';

interface IUnsavedDataWarningConfirmDialogProps {
  actions: DzRecord | null;
  actionsData: DzRecord | null;
  isOpened: boolean;
  onProceed: () => void;
  onCancel: () => void;
}

export const UnsavedDataWarningConfirmDialog: FC<
  IUnsavedDataWarningConfirmDialogProps
> = ({ actions, actionsData, isOpened, onProceed, onCancel }) => {
  const handleAction = async (actionKey: string) => {
    await actions?.[actionKey]?.handler?.(actionKey, actionsData);
    if (actions?.[actionKey]?.navigateAfterCompletion) {
      onProceed();
    }
  };
  if (!isOpened) return null;
  if (!actions) {
    return (
      <Modal
        title={
          <Flex align='center' gap={'0.5rem'}>
            <ExclamationCircleFilled style={{ color: 'orange' }} />
            <Text>
              <Translate i18nKey='unsavedWarningModal.title' />
            </Text>
          </Flex>
        }
        closable={false}
        open={isOpened}
        onOk={onProceed}
        onCancel={onCancel}
        okText={<Translate i18nKey='unsavedWarningModal.ok' />}
        cancelText={<Translate i18nKey='unsavedWarningModal.cancel' />}>
        <Text>
          <Translate i18nKey='unsavedWarningModal.message' />
        </Text>
      </Modal>
    );
  }

  return (
    <Modal
      title={
        <Flex align='center' gap={'0.5rem'}>
          <ExclamationCircleFilled style={{ color: 'orange' }} />
          <Text>
            <Translate i18nKey='unsavedWarningModal.title' />
          </Text>
        </Flex>
      }
      closable={false}
      open={isOpened}
      onCancel={onCancel}
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          {Object.keys(actions || {}).length > 0
            ? Object.keys(actions || {}).map((actionKey) => (
                <Button
                  key={actionKey}
                  onClick={() => handleAction(actionKey)}
                  type={actions?.[actionKey]?.type}
                  danger={actions?.[actionKey]?.danger}>
                  {actions?.[actionKey]?.label}
                </Button>
              ))
            : null}
        </>
      )}>
      <Text>
        <Translate i18nKey="You're exiting in the middle of campaign creation. Would you like to save your progress before leaving?" />
      </Text>
    </Modal>
  );
};
