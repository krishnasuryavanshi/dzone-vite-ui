import { Translate } from '@/components/i18n';
import { MenuProps } from '@/lib/types/uicomponents';
import { Button } from '@/uicomponents/button';
import { Dropdown } from '@/uicomponents/dropdown';
import { Link } from 'react-router';
import { MoreOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { CLR_GRAY_1 } from '@/lib/constants';
import { Tooltip } from '@/uicomponents/tooltip';
import { IRoles } from '../lib/types';
import { Status } from '../lib/enums';
import { ThreeDotsActionsIcon } from '@/uicomponents/icons/svgs';

interface IRoleActionsProps {
  record: IRoles;
  handleClick: () => Promise<void>;
  handleShowUsers: () => void;
}

export const RoleActions: FC<IRoleActionsProps> = ({
  record,
  handleClick,
  handleShowUsers,
}) => {
  const isInactive = record?.users > 0;
  const status = record?.status?.name;
  const statusLabel = status === 'INACTIVE' ? 'Active' : 'Inactive';
  const isMarkAsActiveDisabled = isInactive && status === 'ACTIVE';

  const link = (
    <Tooltip
      placement='top'
      overlayStyle={{ whiteSpace: 'wrap', maxWidth: '12.5rem' }}
      overlayInnerStyle={{
        fontSize: '12px',
        textAlign: 'center',
      }}
      title={<Translate i18nKey='pages.users.label.changeStatus' />}>
      <Link
        to='#'
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isMarkAsActiveDisabled) {
            handleClick();
          }
        }}
        style={{
          display: 'inline-block',
          padding: '0',
          color: !isMarkAsActiveDisabled ? 'inherit' : CLR_GRAY_1,
          cursor: isMarkAsActiveDisabled ? 'not-allowed' : 'pointer',
        }}>
        <Translate i18nKey='Mark as Inactive' />
      </Link>
    </Tooltip>
  );

  const getDropdownMenus = () => {
    const items: MenuProps['items'] = [
      {
        key: '1',
        label: (
          <Link
            to='#'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleShowUsers();
            }}
            style={{
              color: status !== Status.INACTIVE ? 'inherit' : CLR_GRAY_1,
            }}>
            <Translate i18nKey='pages.users.label.viewUsers' />
          </Link>
        ),
      },
    ];
    if (!record?.editable) {
      return items;
    }
    const customRolesActions: MenuProps['items'] = [
      {
        key: '2',
        label: (
          <Link
            to={`/ums/roles/${record.id}`}
            onClick={(e) => {
              e.stopPropagation();
            }}>
            <Translate i18nKey='pages.rolesAndPermissions.label.viewPermissions' />
          </Link>
        ),
      },
      {
        key: '3',
        label: isMarkAsActiveDisabled ? (
          link
        ) : (
          <Link
            to='#'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isMarkAsActiveDisabled) {
                handleClick();
              }
            }}
            style={{
              display: 'inline-block',
              padding: '0',
              color: !isMarkAsActiveDisabled ? 'inherit' : CLR_GRAY_1,
              cursor: isMarkAsActiveDisabled ? 'not-allowed' : 'pointer',
            }}>
            <Translate i18nKey={`Mark as ${statusLabel}`} />
          </Link>
        ),
      },
    ];
    return [items[0], ...customRolesActions];
  };

  return (
    <Dropdown menu={{ items: getDropdownMenus() }} placement='bottomLeft'>
      <Button
        onClick={(e) => e.stopPropagation()}
        icon={<ThreeDotsActionsIcon />}
        type='text'
        className='icon-only-button'
      />
    </Dropdown>
  );
};
