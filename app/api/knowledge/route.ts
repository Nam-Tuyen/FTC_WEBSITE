import { NextRequest, NextResponse } from 'next/server';
import { knowledgeManager } from '@/lib/knowledge-manager';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - Lấy tất cả kiến thức hoặc tìm kiếm
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const stats = searchParams.get('stats') === 'true';

    // Return stats if requested
    if (stats) {
      const knowledgeStats = knowledgeManager.getStats();
      return NextResponse.json({
        success: true,
        data: knowledgeStats
      });
    }

    // Search or get all knowledge
    let knowledge;
    if (query) {
      knowledge = knowledgeManager.search(query, category || undefined);
    } else if (category) {
      knowledge = knowledgeManager.getByCategory(category);
    } else {
      knowledge = knowledgeManager.getAllKnowledge();
    }

    // Return limited fields for list view
    const simplifiedKnowledge = knowledge.map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      tags: item.tags,
      lastUpdated: item.lastUpdated,
      filePath: item.filePath,
      preview: item.content.substring(0, 200) + (item.content.length > 200 ? '...' : '')
    }));

    return NextResponse.json({
      success: true,
      data: simplifiedKnowledge,
      total: simplifiedKnowledge.length
    });

  } catch (error: any) {
    console.error('[api/knowledge] GET Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch knowledge',
        message: error.message
      },
      { status: 500 }
    );
  }
}

// POST - Thêm kiến thức mới
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, category, tags, fileType } = body;

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'title, content, and category are required'
        },
        { status: 400 }
      );
    }

    // Add knowledge
    const newItem = await knowledgeManager.addKnowledge({
      title: title.trim(),
      content: content.trim(),
      category: category.trim(),
      tags: Array.isArray(tags) ? tags : [],
      fileType: fileType || 'md'
    });

    return NextResponse.json({
      success: true,
      data: newItem,
      message: 'Knowledge added successfully'
    });

  } catch (error: any) {
    console.error('[api/knowledge] POST Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add knowledge',
        message: error.message
      },
      { status: 500 }
    );
  }
}

// PUT - Reload knowledge base
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    if (action === 'reload') {
      await knowledgeManager.loadAllKnowledge();
      const stats = knowledgeManager.getStats();
      
      return NextResponse.json({
        success: true,
        message: 'Knowledge base reloaded successfully',
        data: stats
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action',
        message: 'Supported actions: reload'
      },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('[api/knowledge] PUT Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform action',
        message: error.message
      },
      { status: 500 }
    );
  }
}