import { Translate } from '@/components/i18n';
import { Flex } from '@/uicomponents/layout';
import { Modal, Text } from '@/uicomponents';
import { AlertTriangle } from '@/uicomponents/icons/svgs';
import { CLR_RED_1 } from '@/lib/constants';

export const StatusChangeModal = ({
  show,
  handleProceedStatusChange,
  handleCancel,
}: {
  show: boolean;
  handleProceedStatusChange: () => void;
  handleCancel: () => void;
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
              fontSize: '1.2rem',
              fontWeight: 500,
              verticalAlign: 'middle',
            }}
          >
            <Translate i18nKey='pages.rolesAndPermissions.label.statusChangeTitle' />
          </Text>
        </Flex>
      }
      onCancel={handleCancel}
      maskClosable={false}
      centered
      onOk={handleProceedStatusChange}
      okText={<Translate i18nKey='form.actions.proceed' />}
      cancelText={<Translate i18nKey='form.actions.cancel' />}
      open={show}
      okButtonProps={{
        style: {
          background: CLR_RED_1,
        },
      }}
    >
      <Text>
        <Translate i18nKey='pages.rolesAndPermissions.label.statusChangeContent' />
      </Text>
    </Modal>
  );
};
