import { DzBox } from '@/components/layout/v1';
import React, { CSSProperties } from 'react';

import './html-content.scss';
import DOMPurify from 'dompurify';

type HtmlContentProps = {
  htmlStr: string;
  color?: string;
  style?: CSSProperties;
  isUserInput?: boolean; // Flag to indicate if content is from user
};

export const HtmlContent = ({ htmlStr, color, style, isUserInput = false }: HtmlContentProps) => {
  if (!htmlStr) return null;

  // If this is user input, always escape HTML to display literally
  if (isUserInput) {
    // Escape HTML entities to display literally what user typed
    const escapedHtml = htmlStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\n/g, '<br />');

    return (
      <DzBox
        className='show-scroll html-string-content'
        style={{
          fontSize: '0.875rem',
          color: color || 'inherit',
          ...style,
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: escapedHtml }}
          style={{
            wordBreak: 'break-word',
          }}
        />
      </DzBox>
    );
  }

  // For system/AI content, check if it contains HTML
  const hasHtmlTag = /<[^>]+>/.test(htmlStr);
  const processedHtml = hasHtmlTag ? htmlStr : htmlStr?.replace(/\n/g, '<br />');

  // Sanitize system content to prevent XSS but allow safe HTML
  const sanitizedHtml = DOMPurify.sanitize(processedHtml, {
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'style'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onfocus', 'onblur'],
  });

  return (
    <DzBox
      className='show-scroll html-string-content'
      style={{
        fontSize: '0.875rem',
        color: color || 'inherit',
        ...style,
      }}
    >
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        style={{
          wordBreak: 'break-word',
        }}
      />
    </DzBox>
  );
};
