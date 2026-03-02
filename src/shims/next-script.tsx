/**
 * Shim for `next/script`.
 * Renders a plain <script> element in the browser.
 */
import React from 'react';

interface ScriptProps extends React.ScriptHTMLAttributes<HTMLScriptElement> {
  id?: string;
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'worker';
  onLoad?: () => void;
  onReady?: () => void;
  onError?: () => void;
  children?: React.ReactNode;
}

export default function Script({
  strategy,
  onLoad,
  onReady,
  onError,
  children,
  dangerouslySetInnerHTML,
  ...rest
}: ScriptProps) {
  return (
    <script
      {...rest}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    />
  );
}

export { Script };
