import { Hideable, MapFunction } from '@/components/shared';
import { CLR_WHITE } from '@/lib/constants';
import { DzRecord } from '@/lib/types';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { UserMessageViewEnum } from '../../../lib/enums';
import { TextContent } from '../instructions';
import { CustomFieldsContent, CustomQuestionsContent, FilesContent } from './view-messages';

export type UserMessageViewProps = {
  message: DzRecord | null;
};

export const UserMessageView = ({ message }: UserMessageViewProps) => {
  const renderableFieldsList = message?.fields?.filter(
    (field: DzRecord) => field.skip || field.value,
  );

  const renderMessage = (item: DzRecord, index: number) => {
    const { type, value: data, skip } = item;
    const Heading = (
      <Hideable show={renderableFieldsList?.length > 1}>
        <Text text14 strong style={{ color: CLR_WHITE }}>
          {item.label}
        </Text>
      </Hideable>
    );

    if (skip) {
      return (
        <TextContent key={index} data={'Skipped'} isUserInput={true}>
          {Heading}
        </TextContent>
      );
    }

    switch (type) {
      case UserMessageViewEnum.Files:
      case UserMessageViewEnum.MultiFileUpload:
      case UserMessageViewEnum.SingleFileUpload:
        return (
          <FilesContent key={index} files={data as DzRecord[]}>
            {Heading}
          </FilesContent>
        );
      case UserMessageViewEnum.CustomQuestions:
        return (
          <CustomQuestionsContent key={index} customQuestions={data as DzRecord[]}>
            {Heading}
          </CustomQuestionsContent>
        );
      case UserMessageViewEnum.CustomFields:
        return (
          <CustomFieldsContent
            key={index}
            data={
              data as {
                customFields: DzRecord[];
                customFieldInstructions: string;
              }
            }
          >
            {Heading}
          </CustomFieldsContent>
        );
      case UserMessageViewEnum.Actions:
      case UserMessageViewEnum.Radio:
        return (
          <TextContent key={index} data={data.label} isUserInput={true}>
            {Heading}
          </TextContent>
        );
      case UserMessageViewEnum.Checkbox:
      case UserMessageViewEnum.SinglePicklist:
      case UserMessageViewEnum.MultiPicklist:
      case UserMessageViewEnum.CustomRangeOptionsPicklist:
        const text = Array.isArray(data)
          ? data.map((d: DzRecord) => d.label).join(', ')
          : data.label;
        return (
          <TextContent key={index} data={text} isUserInput={true}>
            {Heading}
          </TextContent>
        );
      case UserMessageViewEnum.Daterange:
        return (
          <TextContent key={index} data={`${data.startDate} - ${data.endDate}`} isUserInput={true}>
            {Heading}
          </TextContent>
        );
      default:
        return (
          <TextContent key={index} data={data} isUserInput={true}>
            {Heading}
          </TextContent>
        );
    }
  };

  return (
    <>
      <Hideable show={!!message?.userMessage}>
        <Flex vertical gap={'0.5rem'}>
          <TextContent data={message?.userMessage} isUserInput={true} />
          <Hideable show={message?.fileUploads?.length}>
            <FilesContent files={message?.fileUploads} />
          </Hideable>
        </Flex>
      </Hideable>
      <Hideable show={!!renderableFieldsList?.length}>
        <Flex vertical gap={'0.5rem'}>
          <MapFunction items={renderableFieldsList} renderItem={renderMessage} />
        </Flex>
      </Hideable>
    </>
  );
};
