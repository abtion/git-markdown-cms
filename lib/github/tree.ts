import { getOctokit } from "./octokit";
import type { GitHubTreeItem } from "@/types/github";

export async function fetchGitHubTree(): Promise<GitHubTreeItem[]> {
  const octokit = getOctokit();

  const repo = process.env.GITHUB_REPO;
  const branch = process.env.NEXT_PUBLIC_GITHUB_BRANCH;
  const folder = process.env.NEXT_PUBLIC_GITHUB_FOLDER;

  if (!repo || !branch || !folder) {
    throw new Error("Missing required GitHub environment variables");
  }

  const [owner, repoName] = repo.split("/");

  // First, let's check the repository to see what branches exist
  try {
    const { data: repoData } = await octokit.rest.repos.get({
      owner,
      repo: repoName,
    });

    console.log("Repository default branch:", repoData.default_branch);
    console.log("Trying to access branch:", branch);
  } catch (error) {
    console.error("Error fetching repository:", error);
    throw new Error(
      `Cannot access repository ${owner}/${repoName}. Check your GITHUB_TOKEN permissions.`,
    );
  }

  // Use the repos.getContent API to fetch the tree from a specific path
  try {
    const { data: folderContents } = await octokit.rest.repos.getContent({
      owner,
      repo: repoName,
      path: folder,
      ref: branch,
    });

    if (!Array.isArray(folderContents)) {
      throw new Error(`${folder} is not a directory`);
    }

    // Recursively fetch all files in subdirectories
    const allItems: GitHubTreeItem[] = [];

    async function fetchDirectory(path: string): Promise<void> {
      const { data: contents } = await octokit.rest.repos.getContent({
        owner,
        repo: repoName,
        path,
        ref: branch,
      });

      if (!Array.isArray(contents)) return;

      for (const item of contents) {
        allItems.push({
          path: item.path,
          mode: "100644",
          type: item.type === "dir" ? "tree" : "blob",
          sha: item.sha,
          size: item.size,
          url: item.url,
        });

        if (item.type === "dir") {
          await fetchDirectory(item.path);
        }
      }
    }

    await fetchDirectory(folder);

    return allItems;
  } catch (error: any) {
    console.error("Error fetching folder contents:", error);
    throw new Error(
      `Cannot access folder "${folder}" in branch "${branch}". Error: ${error.message}`,
    );
  }
}
