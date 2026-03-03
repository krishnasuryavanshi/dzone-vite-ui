
import { SendOutlined } from '@/uicomponents/icons';
import { Hideable } from '@/components/shared';
import { COLORS } from '../lib/constants/colors';

interface InputSendButtonProps {
  isStreaming: boolean;
  canSend: boolean;
  onSend: () => void;
  onStop: () => void;
}

export const InputSendButton = ({
  isStreaming,
  canSend,
  onSend,
  onStop,
}: InputSendButtonProps) => {
  return (
    <>
      <Hideable show={isStreaming}>
        <div
          onClick={onStop}
          style={{
            width: '1rem',
            height: '1rem',
            backgroundColor: COLORS.TEXT_PRIMARY,
            borderRadius: '2px',
            cursor: 'pointer',
            marginBottom: '0.125rem',
          }}
        />
      </Hideable>

      <Hideable show={!isStreaming}>
        <SendOutlined
          onClick={canSend ? onSend : undefined}
          style={{
            fontSize: '1.25rem',
            color: canSend ? COLORS.PRIMARY : '#bfbfbf',
            cursor: canSend ? 'pointer' : 'not-allowed',
            paddingBottom: '0.125rem',
          }}
        />
      </Hideable>
    </>
  );
};
