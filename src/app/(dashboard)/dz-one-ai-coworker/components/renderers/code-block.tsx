import { FC, useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/uicomponents';
import { CopyOutlined, CheckOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';

interface CodeBlockProps {
  language: string;
  code: string;
}

export const CodeBlock: FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Failed to copy - silently ignore
    }
  }, [code]);

  const displayLanguage = language || 'text';

  return (
    <Flex
      vertical
      style={{
        borderRadius: '0.5rem',
        overflow: 'hidden',
        margin: '0.5rem 0',
        backgroundColor: '#2d2d2d',
      }}
    >
      <Flex
        justify='space-between'
        align='center'
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#1e1e1e',
          borderBottom: '1px solid #404040',
        }}
      >
        <Text style={{ color: '#a0a0a0', fontSize: '0.75rem' }}>{displayLanguage}</Text>
        <Button
          type='text'
          size='small'
          icon={copied ? <CheckOutlined /> : <CopyOutlined />}
          onClick={handleCopy}
          style={{ color: '#a0a0a0' }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </Flex>
      <pre
        style={{
          margin: 0,
          padding: '1rem',
          overflow: 'auto',
          fontSize: '0.875rem',
          lineHeight: 1.5,
        }}
      >
        <code ref={codeRef} className={`language-${displayLanguage}`}>
          {code.trim()}
        </code>
      </pre>
    </Flex>
  );
};
