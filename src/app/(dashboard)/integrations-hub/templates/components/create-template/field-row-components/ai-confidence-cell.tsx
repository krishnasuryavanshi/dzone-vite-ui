import { Text } from '@/uicomponents/text';
import React, { FC } from 'react';

interface AiConfidenceCellProps {
  confidence: number;
}

// Color logic: High = green, Medium = orange, Low = red
const getConfidenceColor = (confidence: number) => {
  if (confidence >= 80) return '#27ae60'; // green
  if (confidence >= 50) return '#f39c12'; // orange
  return '#e74c3c'; // red
};

export const AiConfidenceCell: FC<AiConfidenceCellProps> = ({ confidence }) => {
  return (
    <Text style={{ color: getConfidenceColor(confidence), fontWeight: 500 }}>{confidence}%</Text>
  );
};
