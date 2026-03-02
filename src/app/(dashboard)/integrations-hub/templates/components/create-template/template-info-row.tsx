import { Translate } from '@/components/i18n';
import { DzBox } from '@/components/layout/v1';
import { Title } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';
import { TemplateInfoForm } from './template-info-form';

interface ITemplateInfoRowProps {
  templateId?: string;
  userId?: string;
  isDzoneUser?: boolean;
  tenantCode: string | string[];
}

export const TemplateInfoRow: FC<ITemplateInfoRowProps> = ({
  templateId,
  userId,
  isDzoneUser = false,
  tenantCode,
}) => {
  return (
    <Flex vertical>
      <TemplateInfoForm
        templateId={templateId}
        userId={userId}
        isDzoneUser={isDzoneUser}
        tenantCode={tenantCode}
      />
    </Flex>
  );
};
