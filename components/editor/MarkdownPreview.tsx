"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import IPhone16Frame from "./iPhone16Frame";
import { useEditorStore } from "@/lib/store/editorStore";
import { useState } from "react";

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

// Custom link component for external and internal links
function CustomLink({
  href,
  children,
  treeData,
}: {
  href?: string;
  children: React.ReactNode;
  treeData: any;
}) {
  const isExternal = href?.startsWith("http");
  const isInternal = href?.startsWith("/Articles");

  if (isInternal && href) {
    // Extract path after /Articles
    const internalPath = href.replace("/Articles", "");

    // Get folder prefix from env
    const folderPrefix = process.env.NEXT_PUBLIC_GITHUB_FOLDER || "content";

    // Build the full path that would be in the tree
    const fullPath = folderPrefix + internalPath;

    // Check if the path exists in the tree data
    const fileExists =
      treeData && treeData[fullPath] && !treeData[fullPath].isFolder;

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();

      const title = "This is an internal link";
      let description = "";

      if (fileExists) {
        description = `This internal link is correct and will show the file found in ${internalPath}. You can see the contents of this file by clicking on it in the left pane`;
      } else {
        description =
          "This internal link DOES NOT correspond to any of the existing files listed in the left pane";
      }

      alert(`${title}\n\n${description}`);
    };

    return (
      <a
        href={href}
        onClick={handleClick}
        className={`hover:underline ${fileExists ? "text-green-700 dark:text-green-600" : "text-red-600 dark:text-red-500"}`}
      >
        {children}
      </a>
    );
  }

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
  const { treeData } = useEditorStore();

  return (
    <IPhone16Frame>
      <div className="prose prose-sm dark:prose-invert max-w-none p-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children }) => (
              <CustomLink href={href} treeData={treeData}>
                {children}
              </CustomLink>
            ),
          }}
        >
          {contentWithoutFrontMatter}
        </ReactMarkdown>
      </div>
    </IPhone16Frame>
  );
}
