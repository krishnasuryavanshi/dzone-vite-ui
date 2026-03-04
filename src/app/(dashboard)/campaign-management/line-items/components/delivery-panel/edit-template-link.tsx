import React from 'react';
import { DZONE_CLR_BLACK, CLR_GRAY } from '@/lib/constants';
import { Link, Text } from '@/uicomponents';
import { Translate } from '@/components/i18n';
import { ITemplateInfo } from '@/app/(dashboard)/integrations-hub/templates/lib/types';

interface IEditTemplateLinkProps {
  isTemplateSelected: boolean;
  selectedTemplate: ITemplateInfo | null;
}

export const EditTemplateLink: React.FC<IEditTemplateLinkProps> = ({
  isTemplateSelected,
  selectedTemplate,
}) => {
  const href = isTemplateSelected
    ? `/integrations-hub/templates/${selectedTemplate?.id}/update?id=${selectedTemplate?.templateId}`
    : '#';

  return (
    <Link
      href={href}
      style={{
        color: isTemplateSelected ? DZONE_CLR_BLACK : '#d9d9d9',
        cursor: isTemplateSelected ? 'pointer' : 'not-allowed',
        textDecoration: 'underline',
        height: '1.5rem',
        padding: '0',
        display: 'inline-block',
      }}
      target={isTemplateSelected ? '_blank' : undefined}
      rel={isTemplateSelected ? 'noopener noreferrer' : undefined}
    >
      <Text
        style={{
          color: isTemplateSelected ? `${DZONE_CLR_BLACK}` : `${CLR_GRAY}`,
        }}
      >
        <Translate i18nKey='Edit Template' />
      </Text>
    </Link>
  );
};
