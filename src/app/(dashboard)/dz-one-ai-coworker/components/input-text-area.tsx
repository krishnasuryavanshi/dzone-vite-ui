import { TextArea } from '@/uicomponents/form/input';
import { DEFAULT_TEXT } from '../lib/constants';

interface InputTextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const InputTextArea = ({ value, onChange, onKeyDown }: InputTextAreaProps) => {
  return (
    <TextArea
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={DEFAULT_TEXT.PLACEHOLDER}
      autoSize={{ minRows: 1, maxRows: 4 }}
      variant='borderless'
      style={{
        flex: 1,
        fontSize: '1rem',
        padding: 0,
        resize: 'none',
      }}
    />
  );
};
