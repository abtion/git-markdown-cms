'use client';

import { useEffect, useState } from 'react';
import {
  UncontrolledTreeEnvironment,
  Tree,
  StaticTreeDataProvider,
} from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import { useEditorStore } from '@/lib/store/editorStore';
import { adaptGitHubTreeToReactComplexTree } from '@/lib/utils/tree-adapter';
import type { TreeData } from '@/types/editor';

export default function FileTree() {
  const [treeData, setTreeData] = useState<TreeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setSelectedFile } = useEditorStore();

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const response = await fetch('/api/github/tree');
        const data = await response.json();

        if (!data.success) {
          setError(data.error || 'Failed to fetch file tree');
          return;
        }

        // Get folder prefix from tree (assumes first item contains it)
        const folderPrefix = process.env.NEXT_PUBLIC_GITHUB_FOLDER || 'content';
        const adaptedTree = adaptGitHubTreeToReactComplexTree(
          data.tree,
          folderPrefix
        );

        setTreeData(adaptedTree);
      } catch (err) {
        setError('Network error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTree();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
        Loading files...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600 dark:text-red-400">{error}</div>
    );
  }

  if (!treeData) {
    return null;
  }

  return (
    <div className="h-full overflow-auto bg-white dark:bg-zinc-950">
      <UncontrolledTreeEnvironment
        dataProvider={new StaticTreeDataProvider(treeData, (item, data) => ({ ...item, data }))}
        getItemTitle={(item) => item.data.name}
        viewState={{}}
        onSelectItems={(items) => {
          const itemId = items[0];
          if (!itemId) return;

          const item = treeData[itemId];
          if (!item || item.isFolder) return;

          setSelectedFile({
            path: item.data.path,
            sha: item.data.sha,
          });
        }}
      >
        <Tree treeId="file-tree" rootItem="root" treeLabel="Files" />
      </UncontrolledTreeEnvironment>
    </div>
  );
}
