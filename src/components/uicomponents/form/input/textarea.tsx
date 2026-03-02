import { TextAreaProps } from 'antd/lib/input';
import { Input } from 'antd';
import React, {
  FC,
  ClipboardEvent,
  ChangeEvent,
  FocusEvent,
  DragEvent,
  CompositionEvent,
} from 'react';
import { sanitizeTextareaInput } from '@/lib/utils/string';

const { TextArea: AntdTextArea } = Input;

const setNativeValue = (element: HTMLTextAreaElement, value: string) => {
  const valueSetter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    'value',
  )?.set;
  valueSetter?.call(element, value);
  element.dispatchEvent(new Event('input', { bubbles: true }));
};

export const TextArea: FC<TextAreaProps> = ({
  children,
  onChange,
  onPaste,
  onBlur,
  onDrop,
  onCompositionEnd,
  ...rest
}) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedValue = sanitizeTextareaInput(e.target.value);
    if (sanitizedValue !== e.target.value) {
      const cursorPos = e.target.selectionStart || 0;
      const diff = e.target.value.length - sanitizedValue.length;
      setNativeValue(e.target, sanitizedValue);
      e.target.setSelectionRange(cursorPos - diff, cursorPos - diff);
    }
    onChange?.(e);
  };

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const sanitized = sanitizeTextareaInput(pastedText);
    const textarea = e.target as HTMLTextAreaElement;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const currentValue = textarea.value;
    const newValue =
      currentValue.substring(0, start) +
      sanitized +
      currentValue.substring(end);
    setNativeValue(textarea, newValue);
    textarea.setSelectionRange(
      start + sanitized.length,
      start + sanitized.length,
    );
    onPaste?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    const sanitizedValue = sanitizeTextareaInput(e.target.value);
    if (sanitizedValue !== e.target.value) {
      setNativeValue(e.target, sanitizedValue);
    }
    onBlur?.(e);
  };

  const handleDrop = (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const droppedText = e.dataTransfer.getData('text');
    if (droppedText) {
      const sanitized = sanitizeTextareaInput(droppedText);
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const currentValue = textarea.value;
      const newValue =
        currentValue.substring(0, start) +
        sanitized +
        currentValue.substring(end);
      setNativeValue(textarea, newValue);
      textarea.setSelectionRange(
        start + sanitized.length,
        start + sanitized.length,
      );
    }
    onDrop?.(e);
  };

  const handleCompositionEnd = (e: CompositionEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    const sanitizedValue = sanitizeTextareaInput(textarea.value);
    if (sanitizedValue !== textarea.value) {
      setNativeValue(textarea, sanitizedValue);
    }
    onCompositionEnd?.(e);
  };

  return (
    <AntdTextArea
      {...rest}
      onChange={handleChange}
      onPaste={handlePaste}
      onBlur={handleBlur}
      onDrop={handleDrop}
      onCompositionEnd={handleCompositionEnd}>
      {children}
    </AntdTextArea>
  );
};
