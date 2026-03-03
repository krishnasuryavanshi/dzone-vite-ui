import { Translate } from '@/components/i18n';
import { MenuProps } from '@/lib/types/uicomponents';
import { Button, Dropdown } from '@/uicomponents';
import { MoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import { FC } from 'react';
import { IUser } from '../lib/types';
import { usePermissionCheck } from '@/lib/hooks';
import { UserActionsEnum } from '@/lib/enums/permissions';
import { ThreeDotsActionsIcon } from '@/uicomponents/icons/svgs';

interface IUserActionsProps {
  record: IUser;
  toggleStatus: (user: IUser) => void;
  resendSetPasswordLink: (user: IUser) => void;
}

const ActionMap = {
  Invited: ['2'],
  Active: ['1', '2', '3'],
  Deactivated: ['1', '2', '3'],
};

export const UsersActions: FC<IUserActionsProps> = ({
  record,
  resendSetPasswordLink,
  toggleStatus,
}) => {
  const status = record.status;
  const statusLabel =
    status === 'Deactivated' ? 'Activate User' : 'Deactivate User';
  const isUpdateAllowed = usePermissionCheck(UserActionsEnum.Update);
  const isEditAllowed = usePermissionCheck(UserActionsEnum.Edit);

  const getDropdownMenus = () => {
    const items: MenuProps['items'] = [
      isUpdateAllowed && {
        key: '1',
        label: (
          <Link
            to='#'
            onClick={(e) => {
              e.stopPropagation();
              toggleStatus(record);
            }}>
            <Translate i18nKey={statusLabel} />
          </Link>
        ),
      },
      isUpdateAllowed && {
        key: '2',
        label: (
          <Link
            to='#'
            onClick={(e) => {
              e.stopPropagation();
              resendSetPasswordLink(record);
            }}>
            <Translate i18nKey='Send password reset link' />
          </Link>
        ),
      },
      isEditAllowed && {
        key: '3',
        label: (
          <Link
            to={`/ums/users/${record.id}`}
            onClick={(e) => {
              e.stopPropagation();
            }}>
            <Translate i18nKey='Edit Details' />
          </Link>
        ),
      },
    ].filter(Boolean) as MenuProps['items'];
    return items?.filter((item) => {
      return ActionMap[status as keyof typeof ActionMap].includes(
        item?.key as string,
      );
    });
  };

  return (
    <Dropdown
      menu={{ items: getDropdownMenus() }}
      placement='bottomLeft'
      disabled={!record.editable}>
      <Button
        onClick={(e) => e.stopPropagation()}
        icon={<ThreeDotsActionsIcon />}
        type='text'
        className='icon-only-button'
      />
    </Dropdown>
  );
};
