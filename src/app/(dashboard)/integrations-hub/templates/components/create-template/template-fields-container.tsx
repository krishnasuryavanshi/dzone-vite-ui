import { Translate } from '@/components/i18n';
import { Title } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';
import { FieldList } from './field-list';
import { FieldToolbar } from './field-toolbar';
import { FieldDrawerWrapper } from './field-drawer';

interface ITemplateFieldsContainerProps {
  templateId?: string;
}

export const TemplateFieldsContainer: FC<ITemplateFieldsContainerProps> = ({
  templateId,
}) => {
  return (
    <Flex vertical>
      <Title level={5} style={{ paddingLeft: '0.5rem' }}>
        <Translate i18nKey='pages.templates.label.fieldMapping' />
      </Title>
      <FieldToolbar templateId={templateId} />
      <FieldList templateId={templateId} />
      <FieldDrawerWrapper />
    </Flex>
  );
};
