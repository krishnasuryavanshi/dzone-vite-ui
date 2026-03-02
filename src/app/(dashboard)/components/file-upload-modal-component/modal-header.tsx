import { Translate } from '@/components/i18n';
import { Title } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';

interface IModalHeaderProps {
  title: string;
}

export const ModalHeader: FC<IModalHeaderProps> = ({ title }) => {
  return (
    <Flex
      vertical
      justify='center'
      align='center'
      style={{
        borderRadius: '0.75rem',
        boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.16)',
        height: '2.5rem',
      }}>
      <Title
        level={5}
        style={{ textAlign: 'center', margin: 0, fontSize: '1rem' }}>
        <Translate i18nKey={title} />
      </Title>
    </Flex>
  );
};
