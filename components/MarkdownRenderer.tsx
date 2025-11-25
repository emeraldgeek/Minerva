import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-p:leading-relaxed prose-li:marker:text-md-sys-color-primary max-w-none">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="!bg-[#1D1B20] !p-4 !rounded-2xl !text-sm"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code {...props} className="bg-md-sys-color-surfaceVariant text-md-sys-color-onSurfaceVariant px-1.5 py-0.5 rounded-md text-sm font-mono">
                {children}
              </code>
            );
          },
          a: ({ node, ...props }) => (
            <a {...props} className="text-md-sys-color-primary hover:text-md-sys-color-onPrimaryContainer underline decoration-md-sys-color-primary/30 transition-colors" target="_blank" rel="noopener noreferrer" />
          ),
          h1: ({node, ...props}) => <h1 {...props} className="text-2xl font-display font-semibold text-md-sys-color-onSurface mt-6 mb-4" />,
          h2: ({node, ...props}) => <h2 {...props} className="text-xl font-display font-medium text-md-sys-color-onSurface mt-5 mb-3" />,
          h3: ({node, ...props}) => <h3 {...props} className="text-lg font-display font-medium text-md-sys-color-onSurface mt-4 mb-2" />,
          p: ({node, ...props}) => <p {...props} className="text-md-sys-color-onSurface/90 mb-3" />,
          ul: ({node, ...props}) => <ul {...props} className="list-disc pl-5 mb-4 space-y-1" />,
          ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-5 mb-4 space-y-1" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
