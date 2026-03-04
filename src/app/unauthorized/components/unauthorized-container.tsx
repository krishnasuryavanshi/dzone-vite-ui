import React from 'react';
import { ExclamationCircleOutlined } from '@/uicomponents/icons';
import { Title, Button } from '@/uicomponents';
import { Flex, Space } from '@/uicomponents/layout';
import { Card } from '@/uicomponents/layout/card';
import { useLogout } from '@/lib/hooks/use-auth';

export const UnauthorizedContainer = () => {
  const { mutate: logout } = useLogout();
  const [logoutInProgress, setLogoutInProgress] = React.useState(false);

  const handleLogout = () => {
    setLogoutInProgress(true);
    logout();
  };

  return (
    <Card bordered={false} style={{ backgroundColor: '#ff5555', margin: '1rem' }}>
      <Space direction='vertical'>
        <Title level={5}>
          <ExclamationCircleOutlined /> Unauthorized Access!
        </Title>
        <Flex>
          <Button type='link' href='/'>
            Go to home
          </Button>
          <Button type='link' disabled={logoutInProgress} onClick={handleLogout}>
            Logout
          </Button>
        </Flex>
      </Space>
    </Card>
  );
};
