"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import IPhone16Frame from "./iPhone16Frame";

interface MarkdownPreviewProps {
  content: string;
}

// Extract title from front matter and remove front matter from content
function processFrontMatter(content: string): string {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    return content;
  }

  const frontMatter = match[1];
  const contentWithoutFrontMatter = content.replace(frontMatterRegex, "");

  // Extract title from front matter
  const titleMatch = frontMatter.match(/^title:\s*(.+)$/m);
  const title = titleMatch
    ? titleMatch[1].trim().replace(/^["']|["']$/g, "")
    : null;

  // If title exists, prepend it as an h1
  if (title) {
    return `# ${title}\n\n${contentWithoutFrontMatter}`;
  }

  return contentWithoutFrontMatter;
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
  const contentWithoutFrontMatter = processFrontMatter(content);

  return (
    <IPhone16Frame>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: CustomLink,
          }}
        >
          {contentWithoutFrontMatter}
        </ReactMarkdown>
      </div>
    </IPhone16Frame>
  );
}
