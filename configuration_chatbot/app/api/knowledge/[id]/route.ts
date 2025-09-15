import { NextRequest, NextResponse } from 'next/server';
import { knowledgeManager } from '@/lib/knowledge-manager';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - Lấy chi tiết một knowledge item
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const knowledge = knowledgeManager.getAllKnowledge();
    const item = knowledge.find(k => k.id === id);

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: 'Knowledge not found',
          message: `No knowledge item found with id: ${id}`
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: item
    });

  } catch (error: any) {
    console.error(`[api/knowledge/${params.id}] GET Error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch knowledge item',
        message: error.message
      },
      { status: 500 }
    );
  }
}