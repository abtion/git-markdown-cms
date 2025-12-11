import { NextRequest, NextResponse } from 'next/server';
import { fetchFileContent } from '@/lib/github/content';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json(
        { success: false, error: 'Path parameter is required' },
        { status: 400 }
      );
    }

    const { content, sha } = await fetchFileContent(path);

    return NextResponse.json({
      success: true,
      content,
      sha,
    });
  } catch (error) {
    console.error('GitHub content fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to fetch content',
      },
      { status: 500 }
    );
  }
}
