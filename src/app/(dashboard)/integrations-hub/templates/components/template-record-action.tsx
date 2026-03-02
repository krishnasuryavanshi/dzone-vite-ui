import { NextLink } from '@/components/shared';
import { MenuProps } from '@/lib/types/uicomponents';
import { Button, Dropdown } from '@/uicomponents';
import { MoreOutlined } from '@/uicomponents/icons';
import { FC } from 'react';
import { ITemplateRow } from '../lib/types';
import { ThreeDotsActionsIcon } from '@/uicomponents/icons/svgs';

interface ITemplateRecordActionProps {
  template: ITemplateRow;
}

export const TemplateRecordAction: FC<ITemplateRecordActionProps> = ({
  template,
}) => {
  const getDropdownMenus = (template: ITemplateRow) => {
    const baseLink = `/integrations-hub/templates/${template.id}/update?id=${template.templateId}`;

    const items: MenuProps['items'] = [
      {
        key: '1',
        label: (
          <NextLink
            link={baseLink}
            label='pages.templates.label.openTemplate'
            checkForUnsavedData={false}
          />
        ),
      },
    ];
    return items;
  };

  return (
    <Dropdown
      menu={{ items: getDropdownMenus(template) }}
      placement='bottomLeft'>
      <Button
        onClick={(e) => e.stopPropagation()}
        icon={<ThreeDotsActionsIcon />}
        type='text'
        className='icon-only-button'
      />
    </Dropdown>
  );
};
