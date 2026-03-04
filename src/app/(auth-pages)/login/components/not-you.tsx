import { Translate } from '@/components/i18n';
import { Link, Text } from '@/uicomponents';
import { LeftOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import React, { FC } from 'react';

interface INotYouProps {
  isFullForm: boolean;
  reset: () => void;
}

const NotYou: FC<INotYouProps> = ({ isFullForm, reset }) => {
  if (!isFullForm) {
    return null;
  }

  return (
    <Flex style={{ marginBottom: '1.25rem' }}>
      <Link onClick={reset}>
        <LeftOutlined style={{ color: '#fff' }} />
        <Text style={{ color: '#fff', marginLeft: '1rem' }}>
          <Translate i18nKey='form.login.notYou' />
        </Text>
      </Link>
    </Flex>
  );
};

export default NotYou;
