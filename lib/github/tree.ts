import { getOctokit } from './octokit';
import type { GitHubTreeItem } from '@/types/github';

export async function fetchGitHubTree(): Promise<GitHubTreeItem[]> {
  const octokit = getOctokit();

  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH;
  const folder = process.env.GITHUB_FOLDER;

  if (!repo || !branch || !folder) {
    throw new Error('Missing required GitHub environment variables');
  }

  const [owner, repoName] = repo.split('/');

  // Get the branch reference to get the tree SHA
  const { data: refData } = await octokit.rest.git.getRef({
    owner,
    repo: repoName,
    ref: `heads/${branch}`,
  });

  const treeSha = refData.object.sha;

  // Get the commit to get the tree
  const { data: commitData } = await octokit.rest.git.getCommit({
    owner,
    repo: repoName,
    commit_sha: treeSha,
  });

  // Get the tree recursively
  const { data: treeData } = await octokit.rest.git.getTree({
    owner,
    repo: repoName,
    tree_sha: commitData.tree.sha,
    recursive: 'true',
  });

  // Filter to items within the specified folder
  const filteredTree = treeData.tree.filter((item) =>
    item.path?.startsWith(folder + '/')
  );

  return filteredTree as GitHubTreeItem[];
}
