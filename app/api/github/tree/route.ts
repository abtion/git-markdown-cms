import { NextResponse } from 'next/server';
import { fetchGitHubTree } from '@/lib/github/tree';

export async function GET() {
  try {
    const tree = await fetchGitHubTree();

    return NextResponse.json({
      success: true,
      tree,
    });
  } catch (error) {
    console.error('GitHub tree fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tree',
      },
      { status: 500 }
    );
  }
}
