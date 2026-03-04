import { Translate } from '@/components/i18n';
import React, { FC } from 'react';
import { Text } from '@/uicomponents/text';
import { usePermissionCheck } from '@/lib/hooks';

interface IFormSectionHeadingProps {
  section: any;
  transKey: string;
}

export const CreateFormSectionHeading: FC<IFormSectionHeadingProps> = ({ section, transKey }) => {
  const showHeader = usePermissionCheck(section?.viewPermissions, false);

  if (section?.showHeader === false || !showHeader) return null;

  return (
    <Text className='section-heading' style={{ paddingBottom: '0.75rem' }} strong>
      <Translate i18nKey={`${transKey}.${section.key}`} />
    </Text>
  );
};
