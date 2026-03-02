import { DzBox } from '@/components/layout/v1';
import { Hideable } from '@/components/shared';
import { TruncatedText } from '@/components/shared/text';
import { CLR_GRAY_4 } from '@/lib/constants';
import { Text } from '@/uicomponents/text';
import React, { useState } from 'react';

type ChatSummaryFieldValueProps = {
  value: any;
  type: string;
};

export const ChatSummaryFieldValue = ({
  value,
  type = 'text',
}: ChatSummaryFieldValueProps) => {
  const [lines, setLines] = useState<number>(2);
  const handleExpand = () => {
    setLines(lines + 2);
  };
  if (!value) {
    return (
      <Text style={{ color: CLR_GRAY_4, fontSize: '0.625rem' }} italic>
        {type === 'file' ? 'No File Uploaded' : 'Not Set'}
      </Text>
    );
  }

  return (
    <DzBox>
      <Hideable show={type === 'text'}>
        <TruncatedText
          lines={lines}
          symbol='view more'
          handleExpand={handleExpand}>
          {value}
        </TruncatedText>
      </Hideable>
    </DzBox>
  );
};
