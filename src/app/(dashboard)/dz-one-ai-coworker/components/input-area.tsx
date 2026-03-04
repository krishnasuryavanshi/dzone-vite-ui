import { WarningOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { AttachmentPreview } from './attachment-preview';
import { InputTextArea } from './input-text-area';
import { InputUploadButton } from './input-upload-button';
import { InputSendButton } from './input-send-button';
import { useInputArea } from './hooks/use-input-area';
import { Hideable } from '@/components/shared';
import { COLORS } from '../lib/constants/colors';

interface InputAreaProps {
  onFileUploadRef?: React.MutableRefObject<((files: File[]) => void) | null>;
}

export const InputArea = ({ onFileUploadRef }: InputAreaProps) => {
  const {
    value,
    attachments,
    isStreaming,
    inputDisabled,
    isTenantUnavailable,
    tenantCode,
    canSend,
    handleSend,
    handleStop,
    handleKeyDown,
    handleChange,
    handleFilesUpload,
    handleRemoveAttachment,
  } = useInputArea(onFileUploadRef);

  return (
    <Flex
      style={{
        padding: '1rem 1.5rem',
        marginInline: '6rem',
        backgroundColor: '#fff',
      }}
    >
      <Hideable show={isTenantUnavailable}>
        <Flex
          align='center'
          justify='center'
          gap='0.5rem'
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            border: '1px solid #ffccc7',
            borderRadius: '1.5rem',
            backgroundColor: '#fff2f0',
          }}
        >
          <WarningOutlined style={{ color: COLORS.ERROR, fontSize: '1rem' }} />
          <Text style={{ color: COLORS.ERROR }}>
            Tenant not available. You cannot send messages.
          </Text>
        </Flex>
      </Hideable>

      <Hideable show={!isTenantUnavailable}>
        <Flex
          vertical
          style={{
            flex: 1,
            position: 'relative',
            border: '1px solid #d9d9d9',
            borderRadius: '1.5rem',
            backgroundColor: '#fff',
          }}
        >
          <AttachmentPreview attachments={attachments} onRemove={handleRemoveAttachment} />

          <Flex align='flex-end' gap='0.75rem' style={{ padding: '0.625rem 1rem' }}>
            <InputUploadButton
              isStreaming={isStreaming}
              inputDisabled={inputDisabled}
              tenantCode={tenantCode}
              onFilesUpload={handleFilesUpload}
            />

            <InputTextArea value={value} onChange={handleChange} onKeyDown={handleKeyDown} />

            <InputSendButton
              isStreaming={isStreaming}
              canSend={canSend}
              onSend={handleSend}
              onStop={handleStop}
            />
          </Flex>
        </Flex>
      </Hideable>
    </Flex>
  );
};
