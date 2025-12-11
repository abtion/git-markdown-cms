'use client';

import { useEffect, useState } from 'react';
import { useEditorStore } from '@/lib/store/editorStore';

export default function MarkdownEditor() {
  const { selectedFile, content, setContent, setOriginalContent, setError } =
    useEditorStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      return;
    }

    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/github/content?path=${encodeURIComponent(selectedFile.path)}`
        );
        const data = await response.json();

        if (!data.success) {
          setError(data.error || 'Failed to fetch content');
          return;
        }

        setOriginalContent(data.content);
      } catch (err) {
        setError('Network error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [selectedFile, setOriginalContent, setError]);

  if (!selectedFile) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500 dark:text-zinc-400">
        Select a markdown file to edit
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500 dark:text-zinc-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {selectedFile.path.split('/').pop()}
        </h3>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 resize-none bg-white p-4 font-mono text-sm text-zinc-900 focus:outline-none dark:bg-zinc-950 dark:text-zinc-50"
        placeholder="Start editing..."
      />
    </div>
  );
}
