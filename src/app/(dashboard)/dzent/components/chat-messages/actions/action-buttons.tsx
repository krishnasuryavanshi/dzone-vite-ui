import { MapFunction } from '@/components/shared';
import { Flex } from '@/uicomponents/layout';
import { ChatWidgetActionButton } from '../../chat-widget/chat-widget-action-button';
import { DzRecord } from '@/lib/types';
import { fileDownload } from '@/services/file-download';

export type ActionButtonsProps = {
  options: DzRecord[];
  handleActionClick: (action: DzRecord) => void;
  selected?: DzRecord;
};

export const ActionButtons = ({
  options,
  handleActionClick,
  selected,
}: ActionButtonsProps) => {
  const handleDownloadFile = async (action: DzRecord) => {
    await fileDownload(action.value);
  };

  const renderActionButton = (action: DzRecord, index: number) => {
    if (action.isDownloadAction) {
      return (
        <ChatWidgetActionButton
          key={`${action.value}-${index}`}
          label={action.label}
          onClick={() => handleDownloadFile(action)}
          tooltip={action.tooltip}
        />
      );
    }
    return (
      <ChatWidgetActionButton
        key={`${action.value}-${index}`}
        label={action.label}
        // focused={selected === action}
        onClick={() => handleActionClick(action)}
        tooltip={action.tooltip}
      />
    );
  };

  return (
    <Flex
      className='chat-action-buttons-container'
      align='center'
      justify='center'
      gap={'0.5rem'}
      wrap='wrap'>
      <MapFunction items={options} renderItem={renderActionButton} />
    </Flex>
  );
};
