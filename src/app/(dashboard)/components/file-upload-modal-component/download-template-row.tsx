import { Translate } from '@/components/i18n';
import { saveFileFromBlob } from '@/lib/utils';
import { Button, Text } from '@/uicomponents';
import { LoadingOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { FC, useState } from 'react';
import { FileTypeSelection } from '../../lib/enums';
import { downloadDataMapperFileTemplate } from '../../integrations-hub/templates/services';
import { HasPermission } from '@/components/auth';
import { DeliveryTemplateActionsEnum } from '@/lib/enums/permissions';
interface IDownloadTemplateRowProps {
  fileTypeSelection: FileTypeSelection;
  downloadTemplateProps?: Record<string, any>;
}

export const DownloadTemplateRow: FC<IDownloadTemplateRowProps> = ({
  fileTypeSelection,
  downloadTemplateProps,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadtemplate = async () => {
    try {
      setIsLoading(true);
      const { data, headers } = await downloadDataMapperFileTemplate(
        downloadTemplateProps?.type,
      );
      if (data) {
        const fileName = headers
          .get('content-disposition')
          .split('filename=')[1];
        saveFileFromBlob(
          data,
          fileName.replaceAll('"', ''),
          headers.get('content-type'),
        );
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex justify='center' gap={'1rem'} align='center'>
      <Text strong>
        <Translate i18nKey='Don’t have the Template? Click Here ' />
      </Text>
      <HasPermission
        permissions={[
          DeliveryTemplateActionsEnum.Create,
          DeliveryTemplateActionsEnum.Edit,
        ]}>
        <Button
          type='primary'
          size='small'
          style={{ width: '10rem' }}
          disabled={isLoading}
          onClick={handleDownloadtemplate}>
          {isLoading ? (
            <LoadingOutlined />
          ) : (
            <Translate i18nKey='Download Template' />
          )}
        </Button>
      </HasPermission>
    </Flex>
  );
};
