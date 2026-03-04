import { Translate } from '@/components/i18n';
import { saveFileFromBlob } from '@/lib/utils';
import { Button } from '@/uicomponents';
import { DownloadOutlined } from '@/uicomponents/icons';
import { FC } from 'react';
import { exportDeliveryTemplateSample } from '../../../services';
import { useTemplateStore } from '../../../stores';

interface IExportSampleProps {}

export const ExportSampleAction: FC<IExportSampleProps> = ({}) => {
  const { existingTemplate, templateId } = useTemplateStore();

  // Hide in create mode (when no existing template)
  if (!existingTemplate) {
    return null;
  }

  const exportSample = async () => {
    const { data, headers } = await exportDeliveryTemplateSample(templateId as string);
    if (data) {
      const fileName = headers.get('content-disposition').split('filename=')[1];
      saveFileFromBlob(data, fileName.replaceAll('"', ''), headers.get('content-type'));
    }
  };

  return (
    <Button
      type='primary'
      size='small'
      style={{ boxShadow: 'none' }}
      disabled={!existingTemplate}
      onClick={exportSample}
    >
      <DownloadOutlined /> <Translate i18nKey='pages.templates.label.exportSample' />
    </Button>
  );
};
