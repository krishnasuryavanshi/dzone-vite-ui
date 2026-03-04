import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './code-block';
import { ChartRenderer } from './chart-renderer';
import styles from './markdown-renderer.module.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className={styles.markdown}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { className, children, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeContent = String(children).replace(/\n$/, '');
            const isInline =
              !node?.position?.start.line ||
              node?.position?.start.line === node?.position?.end.line;

            // Handle chart code blocks
            if (language === 'chart') {
              return <ChartRenderer data={codeContent} />;
            }

            // Handle inline code
            if (isInline && !language) {
              return (
                <code className={styles.inlineCode} {...rest}>
                  {children}
                </code>
              );
            }

            // Handle code blocks with syntax highlighting
            if (language) {
              return <CodeBlock language={language} code={codeContent} />;
            }

            // Default code block without language
            return (
              <pre className={styles.codeBlock}>
                <code {...rest}>{children}</code>
              </pre>
            );
          },
          table({ children }) {
            return (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>{children}</table>
              </div>
            );
          },
          th({ children }) {
            return <th className={styles.th}>{children}</th>;
          },
          td({ children }) {
            return <td className={styles.td}>{children}</td>;
          },
          a({ href, children }) {
            return (
              <a href={href} target='_blank' rel='noopener noreferrer' className={styles.link}>
                {children}
              </a>
            );
          },
          blockquote({ children }) {
            return <blockquote className={styles.blockquote}>{children}</blockquote>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
