import { FC, useMemo } from 'react';
import { useDeliveryTemplatesByMarketerQuery } from '../../hooks';
import { DefaultOptionType, Select } from '@/uicomponents/form/input';
import { Translate } from '@/components/i18n';
import { Flex } from '@/uicomponents/layout';
import {
  ITemplateInfo,
  ITemplateRow,
} from '@/app/(dashboard)/integrations-hub/templates/lib/types';
import { Text } from '@/uicomponents';
import { EditTemplateLink } from './edit-template-link';

interface ITemplateDropdownProps {
  selectedTemplate: ITemplateInfo | null;
  onTemplateChange: (template: ITemplateInfo) => void;
  tenantCode?: string;
  lineItemId?: string;
}

export const TemplateDropdown: FC<ITemplateDropdownProps> = ({
  onTemplateChange,
  selectedTemplate,
  tenantCode,
  lineItemId,
}) => {
  const { data: templatesResponse } = useDeliveryTemplatesByMarketerQuery(tenantCode, lineItemId);

  const templatesData = templatesResponse?.data ?? [];

  const templateListOptions = useMemo(
    () =>
      templatesData.map((item: ITemplateRow) => ({
        value: item.id,
        label: item.name,
      })),
    [templatesData],
  );

  const isTemplateSelected = Boolean(selectedTemplate);

  const filterTemplateOptions = (input: string, option: DefaultOptionType | undefined) => {
    if (!option || input.length < 3) {
      return false;
    }

    const label = option.label;
    if (typeof label === 'string') {
      return label.toLowerCase().includes(input.toLowerCase());
    }

    return false;
  };

  const handleSelectTemplate = (selectedId?: string) => {
    if (selectedId !== undefined) {
      const fullTemplate = templatesData.find(
        (template: ITemplateRow) => template.id === selectedId,
      );
      if (fullTemplate) {
        onTemplateChange(fullTemplate);
      }
    }
  };

  return (
    <Flex vertical style={{ width: '100%' }}>
      <Flex justify='space-between' align='center' style={{ marginBottom: '0.5rem' }}>
        <Text style={{ fontWeight: 'bold' }}>
          <Translate i18nKey='Delivery Template' />
        </Text>
        <EditTemplateLink
          isTemplateSelected={isTemplateSelected}
          selectedTemplate={selectedTemplate}
        />
      </Flex>
      <Select
        className='select-template-name'
        style={{ width: '100%', height: '3rem' }}
        showSearch={true}
        placeholder='Select a Template'
        options={templateListOptions}
        value={selectedTemplate?.id}
        onChange={(selectedId: string) => handleSelectTemplate(selectedId)}
        filterOption={filterTemplateOptions}
      />
    </Flex>
  );
};
