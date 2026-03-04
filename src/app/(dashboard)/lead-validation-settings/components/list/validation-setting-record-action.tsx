import { AppLink } from '@/components/shared';
import { MenuProps } from '@/lib/types/uicomponents';
import { Button, Dropdown } from '@/uicomponents';
import { MoreOutlined } from '@/uicomponents/icons';
import { FC } from 'react';
import { IValidationSettingRow } from '../../lib/types';
import { ThreeDotsActionsIcon } from '@/uicomponents/icons/svgs';

interface IValidationSettingRecordActionProps {
  validationSetting: IValidationSettingRow;
}

export const ValidationSettingRecordAction: FC<IValidationSettingRecordActionProps> = ({
  validationSetting,
}) => {
  const getDropdownMenus = (validationSetting: IValidationSettingRow) => {
    const baseLink = `/lead-validation-settings/organizations/${validationSetting.tenant.code}/settings/${validationSetting.id}`;

    const items: MenuProps['items'] = [
      {
        key: '1',
        label: (
          <AppLink
            link={baseLink}
            label='pages.leadValidationSettings.label.view'
            checkForUnsavedData={false}
          />
        ),
      },
    ];
    return items;
  };

  return (
    <Dropdown menu={{ items: getDropdownMenus(validationSetting) }} placement='bottomLeft'>
      <Button
        onClick={(e) => e.stopPropagation()}
        icon={<ThreeDotsActionsIcon />}
        type='text'
        className='icon-only-button'
      />
    </Dropdown>
  );
};
