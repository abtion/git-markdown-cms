"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import IPhone16Frame from "./iPhone16Frame";

interface MarkdownPreviewProps {
  content: string;
}

// Custom link component for external links
function CustomLink({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  const isExternal = href?.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="text-blue-600 hover:underline dark:text-blue-400"
    >
      {children}
    </a>
  );
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <IPhone16Frame>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: CustomLink,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </IPhone16Frame>
  );
}
