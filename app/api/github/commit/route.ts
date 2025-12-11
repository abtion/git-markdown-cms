import { NextRequest, NextResponse } from "next/server";
import { ensureBranchExists, commitFile } from "@/lib/github/commit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, content, sha } = body;

    if (!path || !content || !sha) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: path, content, sha",
        },
        { status: 400 },
      );
    }

    const repo = process.env.GITHUB_REPO;
    const sourceBranch = process.env.GITHUB_BRANCH;
    const targetBranch = process.env.GITHUB_TARGET_BRANCH;

    if (!repo || !sourceBranch || !targetBranch) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required GitHub environment variables",
        },
        { status: 500 },
      );
    }

    const [owner, repoName] = repo.split("/");

    // Ensure target branch exists (create if not)
    await ensureBranchExists(owner, repoName, sourceBranch, targetBranch);

    // Commit the file
    const commit = await commitFile(
      owner,
      repoName,
      targetBranch,
      path,
      content,
      sha,
    );

    return NextResponse.json({
      success: true,
      commit,
    });
  } catch (error: any) {
    console.error("GitHub commit error:", error);

    // Handle specific GitHub API errors
    let errorMessage = "Failed to commit changes";
    let statusCode = 500;

    if (error.status === 409) {
      errorMessage =
        "File has been modified elsewhere. Please refresh and try again.";
      statusCode = 409;
    } else if (error.status === 404) {
      errorMessage = "Repository or branch not found";
      statusCode = 404;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode },
    );
  }
}
