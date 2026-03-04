import { InfoCircleFilled } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';
import { Translate } from '../i18n';
import { DzBox } from '../layout/v1';
import { Text } from '../uicomponents';

interface IFormControlCustomHelpProps {
  customHelpText?: string;
}

export const FormControlCustomHelp: FC<IFormControlCustomHelpProps> = ({ customHelpText }) => {
  if (!customHelpText) return null;
  return (
    <DzBox style={{ width: '100%', marginTop: '0.5rem' }}>
      <Flex gap={'0.5rem'} align={'center'}>
        <InfoCircleFilled style={{ color: '#000' }} />
        <Text italic style={{ fontSize: '0.875rem', color: '#8e8e8e' }}>
          <Translate i18nKey={customHelpText} />
        </Text>
      </Flex>
    </DzBox>
  );
};
