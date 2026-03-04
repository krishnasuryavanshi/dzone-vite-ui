import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { CheckOutlined, InfoCircleOutlined } from '@/uicomponents/icons';
import { FC } from 'react';

interface IValidationMessagesProps {
  customValidation: Record<string, { message: string; isPassed: boolean }>;
}

export const ValidationMessages: FC<IValidationMessagesProps> = ({ customValidation }) => {
  if (!Object.keys(customValidation)?.length) {
    return null;
  }

  return (
    <Flex vertical gap='0.5rem'>
      {Object.keys(customValidation).map((key) => (
        <Flex gap={'0.5rem'} key={key}>
          <DzBox>
            {customValidation[key].isPassed ? (
              <CheckOutlined style={{ color: '#1A9F0B' }} />
            ) : (
              <InfoCircleOutlined style={{ color: '#F53535' }} />
            )}
          </DzBox>
          <DzBox>
            <Text
              style={{
                color: customValidation[key].isPassed ? '#1A9F0B' : '#95989A',
              }}
            >
              {customValidation[key].message}
            </Text>
          </DzBox>
        </Flex>
      ))}
    </Flex>
  );
};
