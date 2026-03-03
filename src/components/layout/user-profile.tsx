import React from 'react';
import { useGetIdentity, useLogout } from '@/lib/hooks/use-auth';
import { useTranslate } from '@/lib/hooks/use-i18n';
import { Avatar, Popover, Button, Text, Divider } from '@/uicomponents';
import { ApiOutlined, LogoutOutlined } from '@/uicomponents/icons';
import { Space } from '@/uicomponents/layout';
import { Link } from 'react-router';
import './user-profile.scss';
import { Settings, UserIcon } from '@/uicomponents/icons/svgs';
import { HasPermission } from '@/components/auth/has-permission';
import { IntegrationsActionsEnum } from '@/lib/enums/permissions';

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const UserProfile = () => {
  const { data: user } = useGetIdentity<IUser>();
  const translate = useTranslate();
  const { mutate: logout } = useLogout();
  const [logoutInProgress, setLogoutInProgress] = React.useState(false);

  const handleLogout = () => {
    setLogoutInProgress(true);
    logout();
  };

  const content = (
    <div className='user-profile-menu'>
      <Button className='user-profile-menu-item' type='text' block>
        <Settings />
        <Text className='user-profile-menu-item-text'>
          {translate('Account Settings')}
        </Text>
      </Button>

      <Link to='/profile'>
        <Button className='user-profile-menu-item' type='text' block>
          <UserIcon />
          <Text className='user-profile-menu-item-text'>
            {translate('Profile')}
          </Text>
        </Button>
      </Link>
      <div className='user-profile-menu-divider' />

      <Button
        className='user-profile-menu-item'
        type='text'
        block
        danger
        disabled={logoutInProgress}
        onClick={handleLogout}>
        <LogoutOutlined className='user-profile-menu-item-icon' />
        <Text className='user-profile-menu-item-text' type='danger'>
          {translate('Log Out')}
        </Text>
      </Button>
    </div>
  );

  return (
    <Popover placement='bottomRight' title={user?.name} content={content}>
      {(user?.name || user?.avatar) && (
        <Space style={{ marginLeft: '8px' }} size='middle'>
          {(user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />) ||
            (!user?.avatar && <Avatar>{user?.name[0]?.toUpperCase()}</Avatar>)}
        </Space>
      )}
    </Popover>
  );
};
