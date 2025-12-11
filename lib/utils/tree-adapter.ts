import type { GitHubTreeItem } from '@/types/github';
import type { TreeData, TreeItem } from '@/types/editor';

export function adaptGitHubTreeToReactComplexTree(
  githubTree: GitHubTreeItem[],
  folderPrefix: string
): TreeData {
  const treeData: TreeData = {
    root: {
      index: 'root',
      canMove: false,
      isFolder: true,
      children: [],
      data: { name: 'Root', path: '', sha: '' },
    },
  };

  // Filter to items in folder and .md files or folders
  const filteredItems = githubTree.filter(
    (item) =>
      item.path.startsWith(folderPrefix + '/') &&
      (item.type === 'tree' || item.path.endsWith('.md'))
  );

  // Build hierarchical structure
  const pathToParent: Record<string, string> = {};

  filteredItems.forEach((item) => {
    const relativePath = item.path.replace(folderPrefix + '/', '');
    const parts = relativePath.split('/');
    const isFolder = item.type === 'tree';

    treeData[item.path] = {
      index: item.path,
      canMove: false,
      isFolder,
      children: isFolder ? [] : undefined,
      data: {
        name: parts[parts.length - 1],
        path: item.path,
        sha: item.sha,
      },
    };

    // Determine parent path
    let parentPath = 'root';
    if (parts.length > 1) {
      const parentRelativePath = parts.slice(0, -1).join('/');
      parentPath = folderPrefix + '/' + parentRelativePath;
    }

    pathToParent[item.path] = parentPath;
  });

  // Build parent-child relationships
  Object.entries(pathToParent).forEach(([itemPath, parentPath]) => {
    if (treeData[parentPath] && treeData[parentPath].children) {
      treeData[parentPath].children!.push(itemPath);
    }
  });

  return treeData;
}
