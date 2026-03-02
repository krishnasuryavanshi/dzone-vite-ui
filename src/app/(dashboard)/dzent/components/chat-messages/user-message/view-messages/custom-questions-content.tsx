import { DzBox } from '@/components/layout/v1';
import { MapFunction } from '@/components/shared';
import { CLR_WHITE } from '@/lib/constants';
import { DzRecord } from '@/lib/types';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import React from 'react';

export const CustomQuestionsContent = ({
  customQuestions,
  children,
}: {
  customQuestions: DzRecord[];
  children?: React.ReactNode;
}) => {
  const renderQuestion = (questionItem: DzRecord, index: number) => {
    const { question, accepted, rejected } = questionItem;
    return (
      <Flex key={index} vertical gap={'0.5rem'}>
        <DzBox>
          <Text style={{ fontSize: '0.875rem', color: CLR_WHITE }} strong>
            {index + 1}) {question}
          </Text>
        </DzBox>
        <DzBox style={{ marginLeft: '0.5rem' }}>
          <Text style={{ fontSize: '0.875rem', color: CLR_WHITE }}>
            <strong>Accepted answer: </strong>
            {accepted}
          </Text>
        </DzBox>
        <DzBox style={{ marginLeft: '0.5rem' }}>
          <Text style={{ fontSize: '0.875rem', color: CLR_WHITE }}>
            <strong>Rejected answer: </strong>
            {rejected}
          </Text>
        </DzBox>
      </Flex>
    );
  };
  return (
    <Flex vertical gap={'0.5rem'}>
      <DzBox>{children}</DzBox>
      <MapFunction items={customQuestions} renderItem={renderQuestion} />
    </Flex>
  );
};
