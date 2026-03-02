import { Translate } from '@/components/i18n';
import { Flex } from '@/uicomponents/layout';
import { Modal, Text } from '@/uicomponents';
import { AlertTriangle } from '@/uicomponents/icons/svgs';
import { CLR_RED_1 } from '@/lib/constants';

export const DiscardModal = ({
  show,
  handleDiscard,
  handleClose,
}: {
  show: boolean;
  handleDiscard: () => void;
  handleClose: () => void;
}) => {
  return (
    <Modal
      title={
        <Flex align='center' gap={'0.5rem'}>
          <Flex>
            <AlertTriangle style={{ verticalAlign: 'middle' }} />
          </Flex>
          <Text
            style={{
              fontSize: '1.375rem',
              fontWeight: 500,
              verticalAlign: 'middle',
            }}>
            <Translate i18nKey='pages.rolesAndPermissions.label.discardChanges' />
          </Text>
        </Flex>
      }
      onCancel={handleClose}
      maskClosable={false}
      centered
      onOk={handleDiscard}
      okText={<Translate i18nKey='form.actions.discard' />}
      cancelText={<Translate i18nKey='form.actions.cancel' />}
      open={show}
      okButtonProps={{
        style: {
          background: CLR_RED_1,
        },
      }}>
      <Text>
        <Translate i18nKey='pages.rolesAndPermissions.label.discardChangesMessage' />
      </Text>
    </Modal>
  );
};
