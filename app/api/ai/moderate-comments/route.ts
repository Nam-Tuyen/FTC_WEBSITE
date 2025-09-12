import { NextRequest, NextResponse } from 'next/server';
import { moderateBlogComments, ModerateBlogCommentsInput } from '@/ai/flows/moderate-blog-comments';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const comment = typeof body.comment === 'string' ? body.comment.trim() : '';
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment is required' },
        { status: 400 }
      );
    }

    const input: ModerateBlogCommentsInput = { comment };
    const result = await moderateBlogComments(input);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[api/ai/moderate-comments] Error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to moderate comment',
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}