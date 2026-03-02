import { CLR_GRAY_4 } from '@/lib/constants';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { ChatSummaryFieldValue } from './chat-summary-field-value';

type ChatSummaryFieldProps = {
  label: string;
  value: any;
  type: string;
};

export const ChatSummaryField = ({
  label,
  value,
  type,
}: ChatSummaryFieldProps) => {
  return (
    <Flex vertical gap={'0.125rem'}>
      <Text style={{ fontWeight: 700, fontSize: '0.75rem', color: CLR_GRAY_4 }}>
        {label}
      </Text>
      <ChatSummaryFieldValue value={value} type={type} />
    </Flex>
  );
};
