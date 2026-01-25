import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-sm sm:prose-base max-w-none break-words">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, inline, className, children, ...props}: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="relative rounded-md overflow-hidden my-4 bg-black/30 border border-white/10">
                <div className="flex justify-between items-center px-4 py-1.5 bg-white/10 text-xs text-gray-300">
                  <span className="font-mono">{match[1]}</span>
                  <span className="text-xs opacity-50">Code Block</span>
                </div>
                <pre className="!p-4 !m-0 !bg-transparent overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code className="bg-gray-700/50 px-1.5 py-0.5 rounded text-sm font-mono text-gray-200" {...props}>
                {children}
              </code>
            );
          },
          a: ({node, ...props}) => (
            <a 
              className="text-blue-400 hover:underline" 
              target="_blank" 
              rel="noopener noreferrer" 
              {...props} 
            />
          ),
          img: ({node, ...props}) => (
            <span className="block my-4">
              <img 
                className="rounded-2xl shadow-2xl max-w-[250px] sm:max-w-[300px] border-2 border-indigo-500/20 hover:border-indigo-500/50 transition-colors duration-300 object-cover" 
                alt="Content"
                {...props} 
              />
            </span>
          ),
          table: ({node, ...props}) => (
            <div className="overflow-x-auto my-4 border border-gray-700 rounded">
              <table className="min-w-full divide-y divide-gray-700" {...props} />
            </div>
          ),
          th: ({node, ...props}) => (
            <th className="px-3 py-2 bg-gray-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" {...props} />
          ),
          td: ({node, ...props}) => (
            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300 border-t border-gray-700" {...props} />
          ),
          p: ({node, ...props}) => (
            <p className="mb-4 last:mb-0 leading-7" {...props} />
          ),
          ul: ({node, ...props}) => (
            <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />
          ),
          ol: ({node, ...props}) => (
            <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;