import { DzBox } from '@/components/layout/v1';
import React, { useRef, useLayoutEffect } from 'react';

type UserInputProps = {
  placeholder?: string;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
};

export const UserInput = ({ placeholder, disabled, value, onChange, onEnter }: UserInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize logic
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const maxHeight = 160;
      if (!value.includes('\n') && value?.length < 40) {
        textarea.style.height = '28px';
      } else {
        textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
      }
    }
  }, [value]);

  return (
    <DzBox style={{ flex: 1 }}>
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        style={{
          width: '100%',
          minHeight: 28,
          maxHeight: 160,
          resize: 'none',
          overflowY: 'auto',
          border: 'none',
          background: 'transparent',
          boxShadow: 'none',
          paddingLeft: 0,
          paddingRight: 8,
          cursor: disabled ? 'not-allowed' : 'text',
          font: 'inherit',
          outline: 'none',
        }}
        disabled={disabled}
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (!disabled && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onEnter();
          }
        }}
      />
    </DzBox>
  );
};
