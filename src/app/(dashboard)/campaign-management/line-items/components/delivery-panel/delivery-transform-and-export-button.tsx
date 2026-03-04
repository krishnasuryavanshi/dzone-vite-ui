import { ITemplateInfo } from '@/app/(dashboard)/integrations-hub/templates/lib/types';
import { Translate } from '@/components/i18n';
import { Button } from '@/uicomponents/button';
import { TransformAndExport } from '@/uicomponents/icons/svgs';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';

interface IDeliveryTransformAndExportButtonProps {
  openModal: () => void;
  selectedTemplate: ITemplateInfo | null;
}

export const DeliveryTransformAndExportButton: FC<IDeliveryTransformAndExportButtonProps> = ({
  openModal,
  selectedTemplate,
}) => (
  <Button
    type='primary'
    className='dz-btn-action-1'
    onClick={openModal}
    disabled={!selectedTemplate}
  >
    <Flex gap='0.2rem'>
      <Translate i18nKey='pages.transformAndExport' />
      <TransformAndExport disabled={!selectedTemplate} />
    </Flex>
  </Button>
);
