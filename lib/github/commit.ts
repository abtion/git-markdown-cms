import { getOctokit } from "./octokit";

export async function ensureBranchExists(
  owner: string,
  repo: string,
  sourceBranch: string,
  targetBranch: string,
): Promise<void> {
  const octokit = getOctokit();

  try {
    // Check if target branch exists
    await octokit.rest.repos.getBranch({
      owner,
      repo,
      branch: targetBranch,
    });
    // Branch exists, nothing to do
  } catch (error: any) {
    if (error.status === 404) {
      // Branch doesn't exist, create it
      // Get source branch SHA
      const { data: sourceRef } = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${sourceBranch}`,
      });

      // Create new branch
      await octokit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${targetBranch}`,
        sha: sourceRef.object.sha,
      });
    } else {
      throw error;
    }
  }
}

export async function commitFile(
  owner: string,
  repo: string,
  branch: string,
  path: string,
  content: string,
  sha: string,
): Promise<{ sha: string; url: string }> {
  const octokit = getOctokit();

  const { data } = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: "chore: Update markdown content",
    content: Buffer.from(content).toString("base64"),
    sha,
    branch,
  });

  if (!data.commit?.sha || !data.commit?.html_url) {
    throw new Error("Failed to commit file: Missing commit data");
  }

  return {
    sha: data.commit.sha,
    url: data.commit.html_url,
  };
}
