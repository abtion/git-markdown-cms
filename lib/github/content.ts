import { getOctokit } from './octokit';
import type { GitHubContent } from '@/types/github';

export async function fetchFileContent(
  path: string
): Promise<{ content: string; sha: string }> {
  const octokit = getOctokit();

  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH;

  if (!repo || !branch) {
    throw new Error('Missing required GitHub environment variables');
  }

  const [owner, repoName] = repo.split('/');

  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo: repoName,
    path,
    ref: branch,
  });

  // Ensure we have file data (not a directory)
  if (Array.isArray(data) || data.type !== 'file') {
    throw new Error('Path does not point to a file');
  }

  const fileData = data as GitHubContent;

  // Decode base64 content
  const decodedContent = Buffer.from(fileData.content, 'base64').toString(
    'utf-8'
  );

  return {
    content: decodedContent,
    sha: fileData.sha,
  };
}
