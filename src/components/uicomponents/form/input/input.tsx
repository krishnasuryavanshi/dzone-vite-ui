import { InputProps } from 'antd/lib/input';
import { Input as AntdInput } from 'antd';
import React, {
  FC,
  ClipboardEvent,
  ChangeEvent,
  FocusEvent,
  DragEvent,
  CompositionEvent,
} from 'react';
import { sanitizeInput } from '@/lib/utils/string';

const setNativeValue = (element: HTMLInputElement, value: string) => {
  const valueSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;
  valueSetter?.call(element, value);
  element.dispatchEvent(new Event('input', { bubbles: true }));
};

export const Input: FC<InputProps> = ({
  children,
  onChange,
  onPaste,
  onBlur,
  onDrop,
  onCompositionEnd,
  ...rest
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    if (sanitizedValue !== e.target.value) {
      const cursorPos = e.target.selectionStart || 0;
      const diff = e.target.value.length - sanitizedValue.length;
      setNativeValue(e.target, sanitizedValue);
      e.target.setSelectionRange(cursorPos - diff, cursorPos - diff);
    }
    onChange?.(e);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const sanitized = sanitizeInput(pastedText);
    const input = e.target as HTMLInputElement;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const currentValue = input.value;
    const newValue =
      currentValue.substring(0, start) +
      sanitized +
      currentValue.substring(end);
    setNativeValue(input, newValue);
    input.setSelectionRange(start + sanitized.length, start + sanitized.length);
    onPaste?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    if (sanitizedValue !== e.target.value) {
      setNativeValue(e.target, sanitizedValue);
    }
    onBlur?.(e);
  };

  const handleDrop = (e: DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    const droppedText = e.dataTransfer.getData('text');
    if (droppedText) {
      const sanitized = sanitizeInput(droppedText);
      const input = e.target as HTMLInputElement;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const currentValue = input.value;
      const newValue =
        currentValue.substring(0, start) +
        sanitized +
        currentValue.substring(end);
      setNativeValue(input, newValue);
      input.setSelectionRange(
        start + sanitized.length,
        start + sanitized.length,
      );
    }
    onDrop?.(e);
  };

  const handleCompositionEnd = (e: CompositionEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const sanitizedValue = sanitizeInput(input.value);
    if (sanitizedValue !== input.value) {
      setNativeValue(input, sanitizedValue);
    }
    onCompositionEnd?.(e);
  };

  return (
    <AntdInput
      {...rest}
      onChange={handleChange}
      onPaste={handlePaste}
      onBlur={handleBlur}
      onDrop={handleDrop}
      onCompositionEnd={handleCompositionEnd}>
      {children}
    </AntdInput>
  );
};
