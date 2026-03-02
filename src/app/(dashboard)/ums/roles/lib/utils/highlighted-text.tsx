import { Flex, Space } from '@/uicomponents/layout';
import React from 'react';
import { HighlightedActionWords } from '../enums';

interface HighlightedTextProps {
  text: string;
  highlightColor?: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({
  text = '',
  highlightColor = 'blue',
}) => {
  const highlightWords = Object.values(HighlightedActionWords);
  const regex = new RegExp(`(${highlightWords.join('|')})`, 'gi');
  const parts = text.split(regex);
  return (
    <Flex>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {highlightWords.some(
            (word: string) => word.toLowerCase() === part.toLowerCase(),
          ) ? (
            <Space style={{ color: highlightColor, fontWeight: 600 }}>
              {' '}
              {part}{' '}
            </Space>
          ) : (
            part
          )}
        </React.Fragment>
      ))}
    </Flex>
  );
};

export default HighlightedText;
