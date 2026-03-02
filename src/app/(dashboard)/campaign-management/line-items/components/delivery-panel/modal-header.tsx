import { Translate } from '@/components/i18n';
import { DZONE_CLR_BLACK } from '@/lib/constants';
import { Title } from '@/uicomponents';
import { TransformAndExport } from '@/uicomponents/icons/svgs';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';

interface IModalHeaderProps {
  title: string;
}

export const ModalHeader: FC<IModalHeaderProps> = ({ title }) => {
  return (
    <Flex gap='1.25rem' align='center'>
      <TransformAndExport
        style={{
          background: `${DZONE_CLR_BLACK}`,
          padding: '0.5rem 0.75rem',
          borderRadius: '50%',
        }}
      />
      <Title level={4} style={{ margin: 0 }}>
        <Translate i18nKey={title} />
      </Title>
    </Flex>
  );
};
