import { Hideable, MapFunction } from '@/components/shared';
import { HtmlContent } from '../instructions';
import { DzRecord } from '@/lib/types';

export type SystemMessageInstructionsProps = {
  message: DzRecord[];
};

export const SystemMessageInstructions = ({ message }: SystemMessageInstructionsProps) => {
  const renderMessages = (msg: DzRecord) => {
    return <HtmlContent htmlStr={msg?.message} />;
  };
  return (
    <Hideable show={!!message?.length}>
      <MapFunction items={message} renderItem={renderMessages} />
    </Hideable>
  );
};
