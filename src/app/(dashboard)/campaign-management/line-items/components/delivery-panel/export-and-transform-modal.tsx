import { Flex, Space } from '@/uicomponents/layout';
import { FC } from 'react';
import { Translate } from '@/components/i18n';
import { EXPORT_INFO_MESSAGE } from '../../lib/constants/delivery-message-constants';
import { Text } from '@/uicomponents';

interface IExportAndTransformModalProps {
  filterLeadsCount: number;
}
export const ExportAndTransformModal: FC<IExportAndTransformModalProps> = ({
  filterLeadsCount,
}) => {
  return (
    <Flex vertical style={{ marginLeft: '1.5rem', padding: '1rem' }}>
      <Space
        direction='vertical'
        style={{
          width: '100%',
          listStyleType: 'disc',
          paddingInlineStart: '2.5rem',
        }}
      >
        <Text style={{ display: 'list-item', marginBottom: '0' }}>
          <strong>{filterLeadsCount}</strong>{' '}
          <Translate
            i18nKey='leads are being selected for transformation and
        export.'
          />
        </Text>
        <Text style={{ display: 'list-item' }}>
          <Translate i18nKey={EXPORT_INFO_MESSAGE} />
        </Text>
      </Space>
    </Flex>
  );
};
