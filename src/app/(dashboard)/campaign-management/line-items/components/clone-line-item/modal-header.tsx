import { Translate } from '@/components/i18n';
import { DZONE_CLR_BLACK, CLR_WHITE } from '@/lib/constants';
import { CopyOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Title } from '@/uicomponents/title';
import { FC } from 'react';

interface IModalHeaderProps {}

export const ModalHeader: FC<IModalHeaderProps> = ({}) => {
  return (
    <Flex gap='0.5rem'>
      <CopyOutlined
        style={{
          background: `${DZONE_CLR_BLACK}`,
          borderRadius: '50%',
          color: `${CLR_WHITE}`,
          padding: '8px',
        }}
      />
      <Title level={4} style={{ margin: 0, fontWeight: 500 }}>
        <Translate i18nKey='pages.lineItems.label.cloneLineItem' />
      </Title>
    </Flex>
  );
};
