import { Translate } from '@/components/i18n';
import { Flex } from '@/uicomponents/layout';
import { Title } from '@/uicomponents/title';
import React, { FC } from 'react';

interface IFormHeaderProps {
  heading: string;
}

export const FormHeader: FC<IFormHeaderProps> = ({ heading }) => {
  return (
    <Flex className='form-header' justify='center' align='center'>
      <Title level={5} className='form-title'>
        <Translate i18nKey={heading} />
      </Title>
    </Flex>
  );
};
