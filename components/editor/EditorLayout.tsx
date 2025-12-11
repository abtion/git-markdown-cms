'use client';

import FileTree from './FileTree';
import MarkdownEditor from './MarkdownEditor';
import MarkdownPreview from './MarkdownPreview';
import SaveButton from './SaveButton';
import UnsavedChangesPrompt from './UnsavedChangesPrompt';
import { useEditorStore } from '@/lib/store/editorStore';

export default function EditorLayout() {
  const { content, error } = useEditorStore();

  return (
    <>
      <UnsavedChangesPrompt />
      <div className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Markdown CMS
          </h1>
          <SaveButton />
        </div>

        {/* Error banner */}
        {error && (
          <div className="border-b border-red-200 bg-red-50 px-6 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Main content - three panes */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left pane - File Tree (25%) */}
          <div className="w-1/4 border-r border-zinc-200 dark:border-zinc-800">
            <FileTree />
          </div>

          {/* Middle pane - Markdown Editor (40%) */}
          <div className="w-2/5 border-r border-zinc-200 dark:border-zinc-800">
            <MarkdownEditor />
          </div>

          {/* Right pane - Preview (35%) */}
          <div className="w-[35%] overflow-auto">
            <MarkdownPreview content={content} />
          </div>
        </div>
      </div>
    </>
  );
}
